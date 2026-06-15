import { Request, Response, NextFunction } from 'express';
import * as barberService from '../services/barber.service';
import { sendSuccess } from '../utils/response';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const barbers = await barberService.listBarbers();
    return sendSuccess(res, barbers);
  } catch (error) {
    return next(error);
  }
}

export async function commissions(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await barberService.getBarberCommissions(String(req.params.barberId));
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}
