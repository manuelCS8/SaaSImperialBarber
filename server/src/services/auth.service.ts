import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { User, UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';
const accessSignOptions: SignOptions = { expiresIn: '15m' };
const refreshSignOptions: SignOptions = { expiresIn: '7d' };

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface LoginResult {
  user: Pick<User, 'id' | 'email' | 'role' | 'status'>;
  accessToken: string;
  refreshToken: string;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function signAccessToken(user: User): string {
  const payload: AuthTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, ACCESS_SECRET, accessSignOptions);
}

function signRefreshToken(user: User): string {
  return jwt.sign({ sub: user.id }, REFRESH_SECRET, refreshSignOptions);
}

export async function registerUser(input: {
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  commissionPercentage?: number;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
        status: UserStatus.active,
      },
    });

    if (input.role === UserRole.barber && input.name) {
      await tx.barberProfile.create({
        data: {
          userId: user.id,
          name: input.name,
          commissionPercentage: input.commissionPercentage ?? 40,
        },
      });
    }

    return user;
  });
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.status === UserStatus.blocked) {
    throw new Error('USER_BLOCKED');
  }

  if (user.status === UserStatus.inactive) {
    throw new Error('USER_INACTIVE');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiry,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(refreshToken: string) {
  let payload: JwtPayload;

  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  const stored = await prisma.refreshToken.findFirst({
    where: {
      userId: payload.sub,
      tokenHash: hashToken(refreshToken),
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!stored) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const accessToken = signAccessToken(stored.user);
  const newRefreshToken = signRefreshToken(stored.user);

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: stored.user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: refreshExpiry,
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { tokenHash: hashToken(refreshToken) },
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AuthTokenPayload;
}
