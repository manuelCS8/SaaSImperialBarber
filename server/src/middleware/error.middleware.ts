import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const message = error instanceof Error ? error.message : 'Error interno del servidor';

  const statusMap: Record<string, number> = {
    INVALID_CREDENTIALS: 403,
    USER_BLOCKED: 403,
    USER_INACTIVE: 403,
    INVALID_REFRESH_TOKEN: 401,
    EMAIL_ALREADY_EXISTS: 409,
    APPOINTMENT_NOT_FOUND: 404,
    PRODUCT_NOT_FOUND: 404,
    INVALID_SERVICES: 400,
    INSUFFICIENT_STOCK: 400,
    COMMISSION_ALREADY_CALCULATED: 409,
  };

  const status = statusMap[message] ?? 500;
  const code = status === 500 ? 'INTERNAL_ERROR' : message;

  if (status === 500) {
    console.error(error);
  }

  return sendError(res, message, status, code);
}
