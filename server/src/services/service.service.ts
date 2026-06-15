import { prisma } from '../lib/prisma';

export async function listServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function createService(input: {
  name: string;
  price: number;
  durationMinutes: number;
}) {
  return prisma.service.create({ data: input });
}
