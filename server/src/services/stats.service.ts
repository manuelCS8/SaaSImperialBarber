import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOperationalStatsService = async () => {
  // Ejecuta todas las queries al mismo tiempo en paralelo
  const [
    totalClients,
    appointmentsScheduled,
    appointmentsConfirmed,
    criticalProducts,
    totalCommissions
  ] = await Promise.all([
    // totalClients -> prisma.client.count()
    prisma.client.count(),

    // citas con status 'scheduled'
    prisma.appointment.count({ where: { status: 'scheduled' } }),

    // citas con status 'confirmed'
    prisma.appointment.count({ where: { status: 'confirmed' } }),

    // productos donde stock <= criticalLimit
    prisma.product.count({
      where: {
        stock: {
          lte: prisma.product.fields.criticalLimit
        }
      }
    }),

    // suma de commissionAmount
    prisma.commission.aggregate({
      _sum: {
        commissionAmount: true
      }
    })
  ]);

  return {
    totalClients,
    appointmentsScheduled,
    appointmentsConfirmed,
    criticalProducts,
    totalCommissions: totalCommissions._sum.commissionAmount || 0
  };
};