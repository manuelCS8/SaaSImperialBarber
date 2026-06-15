import { prisma } from '../lib/prisma';

export async function listBarbers() {
  return prisma.barberProfile.findMany({
    include: { user: { select: { id: true, email: true, status: true, role: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function getBarberCommissions(barberId: string) {
  return prisma.commission.findMany({
    where: { barberId },
    include: {
      appointment: {
        include: {
          client: true,
          services: { include: { service: true } },
        },
      },
      payment: true,
    },
    orderBy: { calculatedAt: 'desc' },
  });
}
