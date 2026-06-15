import { InventoryMovementType } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function listCriticalInventory() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  return products.filter((product) => product.stock <= product.criticalLimit);
}

export async function registerInventoryMovement(input: {
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  reason?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: input.productId } });
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const delta = input.type === InventoryMovementType.out ? -input.quantity : input.quantity;
    const nextStock = product.stock + delta;

    if (nextStock < 0) {
      throw new Error('INSUFFICIENT_STOCK');
    }

    const movement = await tx.inventoryMovement.create({ data: input });
    const updatedProduct = await tx.product.update({
      where: { id: input.productId },
      data: { stock: nextStock },
    });

    return { movement, product: updatedProduct };
  });
}
