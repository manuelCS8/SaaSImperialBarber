import { prisma } from '../lib/prisma';
import { normalizePhone, validateClientName, validatePhone } from '../utils/validation';

export async function listClients() {
  return prisma.client.findMany({ orderBy: { name: 'asc' } });
}

export async function createClient(input: {
  name: string;
  phone: string;
  email?: string;
}) {
  validateClientName(input.name);
  const phone = validatePhone(input.phone);

  const existing = await prisma.client.findUnique({ where: { phone } });
  if (existing) {
    throw new Error('Ya existe un cliente con ese teléfono');
  }

  return prisma.client.create({
    data: {
      name: input.name.trim(),
      phone,
      email: input.email?.trim() || undefined,
    },
  });
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
