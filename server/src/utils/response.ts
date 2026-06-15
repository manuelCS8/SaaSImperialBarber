import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operación exitosa',
  status = 200
) {
  return res.status(status).json({
    status: 'success',
    data,
    message,
  });
}

export function sendError(
  res: Response,
  message: string,
  status = 400,
  code = 'BAD_REQUEST'
) {
  return res.status(status).json({
    status: 'error',
    message,
    code,
  });
}
