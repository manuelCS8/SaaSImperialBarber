import { Request, Response, NextFunction } from 'express';
import * as serviceService from '../services/service.service';
import { sendError, sendSuccess } from '../utils/response';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const services = await serviceService.listServices();
    return sendSuccess(res, services);
  } catch (error) {
    return next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, price, durationMinutes } = req.body;

    if (!name || price === undefined || !durationMinutes) {
      return sendError(res, 'name, price y durationMinutes son obligatorios', 400);
    }

    const service = await serviceService.createService({
      name,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
    });

    return sendSuccess(res, service, 'Servicio creado', 201);
  } catch (error) {
    return next(error);
  }
}
