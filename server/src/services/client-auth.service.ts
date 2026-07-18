import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
}

export async function getClientProfileByUserId(userId: string): Promise<ClientProfile | null> {
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true, name: true, phone: true, email: true },
  });

  return client;
}

export async function registerClientAccount(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
}) {
  const normalizedPhone = input.phone.trim();
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const existingClient = await prisma.client.findUnique({
    where: { phone: normalizedPhone },
  });

  if (existingClient?.userId) {
    throw new Error('PHONE_ALREADY_LINKED');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: UserRole.client,
        status: UserStatus.active,
      },
    });

    const client = existingClient
      ? await tx.client.update({
          where: { id: existingClient.id },
          data: {
            userId: user.id,
            name: input.name.trim(),
            email: normalizedEmail,
          },
          select: { id: true, name: true, phone: true, email: true },
        })
      : await tx.client.create({
          data: {
            userId: user.id,
            name: input.name.trim(),
            phone: normalizedPhone,
            email: normalizedEmail,
          },
          select: { id: true, name: true, phone: true, email: true },
        });

    return { user, client };
  });
}

export async function requireClientIdForUser(userId: string): Promise<string> {
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!client) {
    throw new Error('CLIENT_PROFILE_NOT_FOUND');
  }

  return client.id;
}
