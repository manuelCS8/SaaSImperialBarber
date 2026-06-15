import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { verifyAccessToken } from '../services/auth.service';
import { sendError } from '../utils/response';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'Token de acceso requerido', 401, 'UNAUTHORIZED');
  }

  try {
    const token = header.slice(7);
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return sendError(res, 'Token inválido o expirado', 401, 'UNAUTHORIZED');
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'No autenticado', 401, 'UNAUTHORIZED');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'No tienes permisos para esta acción', 403, 'FORBIDDEN');
    }

    return next();
  };
}
