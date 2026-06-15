import { Request, Response, NextFunction } from 'express';
import { InventoryMovementType } from '@prisma/client';
import * as inventoryService from '../services/inventory.service';
import { sendError, sendSuccess } from '../utils/response';

export async function critical(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await inventoryService.listCriticalInventory();
    return sendSuccess(res, products);
  } catch (error) {
    return next(error);
  }
}

export async function movement(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, type, quantity, reason } = req.body;

    if (!productId || !type || !quantity) {
      return sendError(res, 'productId, type y quantity son obligatorios', 400);
    }

    const result = await inventoryService.registerInventoryMovement({
      productId,
      type: type as InventoryMovementType,
      quantity: Number(quantity),
      reason,
    });

    return sendSuccess(res, result, 'Movimiento de inventario registrado', 201);
  } catch (error) {
    return next(error);
  }
}
