import { Request, Response, NextFunction } from 'express';
import * as clientService from '../services/client.service';
import { sendError, sendSuccess } from '../utils/response';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const clients = await clientService.listClients();
    return sendSuccess(res, clients);
  } catch (error) {
    return next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return sendError(res, 'name y phone son obligatorios', 400);
    }

    const client = await clientService.createClient({ name, phone, email });
    return sendSuccess(res, client, 'Cliente creado', 201);
  } catch (error) {
    return next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const client = await clientService.getClientById(String(req.params.id));

    if (!client) {
      return sendError(res, 'Cliente no encontrado', 404, 'NOT_FOUND');
    }

    return sendSuccess(res, client);
  } catch (error) {
    return next(error);
  }
}
