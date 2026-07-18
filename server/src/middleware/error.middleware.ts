import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response';

function getFriendlyMessage(error: unknown): { message: string; status: number; code: string } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target.join(', ')
        : 'dato';
      if (String(field).includes('phone')) {
        return {
          message: 'Ya existe un cliente con ese teléfono',
          status: 409,
          code: 'PHONE_ALREADY_EXISTS',
        };
      }
      return {
        message: 'Ya existe un registro con esos datos',
        status: 409,
        code: 'DUPLICATE_ENTRY',
      };
    }
  }

  const message = error instanceof Error ? error.message : 'Error interno del servidor';

  const friendlyMessages: Record<string, string> = {
    PHONE_ALREADY_LINKED: 'Este teléfono ya está vinculado a otra cuenta',
    CLIENT_PROFILE_NOT_FOUND: 'No se encontró el perfil de cliente vinculado a tu cuenta',
  };

  const statusMap: Record<string, number> = {
    INVALID_CREDENTIALS: 403,
    USER_BLOCKED: 403,
    USER_INACTIVE: 403,
    INVALID_REFRESH_TOKEN: 401,
    EMAIL_ALREADY_EXISTS: 409,
    PHONE_ALREADY_LINKED: 409,
    CLIENT_PROFILE_NOT_FOUND: 404,
    APPOINTMENT_NOT_FOUND: 404,
    PRODUCT_NOT_FOUND: 404,
    INVALID_SERVICES: 400,
    INSUFFICIENT_STOCK: 400,
    COMMISSION_ALREADY_CALCULATED: 409,
    'Ya existe un cliente con ese teléfono': 409,
  };

  const status = statusMap[message] ?? 500;
  const code = status === 500 ? 'INTERNAL_ERROR' : message;
  const displayMessage = friendlyMessages[message] ?? message;

  return { message: displayMessage, status, code };
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { message, status, code } = getFriendlyMessage(error);

  if (status === 500) {
    console.error(error);
  }

  return sendError(res, message, status, code);
}
