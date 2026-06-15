import { prisma } from '../lib/prisma';

export async function listClients() {
  return prisma.client.findMany({ orderBy: { name: 'asc' } });
}

export async function createClient(input: {
  name: string;
  phone: string;
  email?: string;
}) {
  return prisma.client.create({ data: input });
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { barber: true, services: { include: { service: true } } },
        orderBy: { appointmentDate: 'desc' },
      },
      aestheticHistories: {
        include: { barber: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}
