import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import * as authService from '../services/auth.service';
import * as clientAuthService from '../services/client-auth.service';
import { sendError, sendSuccess } from '../utils/response';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, role, name, commissionPercentage } = req.body;

    if (!email || !password || !role) {
      return sendError(res, 'email, password y role son obligatorios', 400);
    }

    if (role === UserRole.client) {
      return sendError(
        res,
        'Para registrarte como cliente usa POST /auth/register/client',
        400,
        'USE_CLIENT_REGISTER'
      );
    }

    const user = await authService.registerUser({
      email,
      password,
      role: role as UserRole,
      name,
      commissionPercentage,
    });

    return sendSuccess(res, { id: user.id, email: user.email, role: user.role }, 'Usuario registrado', 201);
  } catch (error) {
    return next(error);
  }
}

export async function registerClient(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name || !phone) {
      return sendError(res, 'email, password, name y phone son obligatorios', 400);
    }

    if (password.length < 8) {
      return sendError(res, 'La contraseña debe tener al menos 8 caracteres', 400);
    }

    const { user, client } = await clientAuthService.registerClientAccount({
      email,
      password,
      name,
      phone,
    });

    const login = await authService.loginUser(email, password);

    res.cookie('refreshToken', login.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        user: {
          ...login.user,
          clientProfile: client,
        },
        accessToken: login.accessToken,
      },
      'Cuenta de cliente creada',
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'email y password son obligatorios', 400);
    }

    const result = await authService.loginUser(email, password);

    let clientProfile;
    if (result.user.role === UserRole.client) {
      clientProfile = await clientAuthService.getClientProfileByUserId(result.user.id);
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, {
      user: {
        ...result.user,
        ...(clientProfile ? { clientProfile } : {}),
      },
      accessToken: result.accessToken,
    }, 'Inicio de sesión exitoso');
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken ?? req.body.refreshToken;

    if (!token) {
      return sendError(res, 'Refresh token requerido', 401, 'UNAUTHORIZED');
    }

    const result = await authService.refreshSession(token);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { accessToken: result.accessToken }, 'Token renovado');
  } catch (error) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken ?? req.body.refreshToken;

    if (token) {
      await authService.logoutUser(token);
    }

    res.clearCookie('refreshToken');
    return sendSuccess(res, null, 'Sesión cerrada');
  } catch (error) {
    return next(error);
  }
}
