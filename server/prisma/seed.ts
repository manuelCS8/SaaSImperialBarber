import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient, UserRole } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@imperialbarber.com' },
    update: {},
    create: {
      email: 'admin@imperialbarber.com',
      passwordHash,
      role: UserRole.admin_owner,
    },
  });

  const barberUser = await prisma.user.upsert({
    where: { email: 'barber@imperialbarber.com' },
    update: {},
    create: {
      email: 'barber@imperialbarber.com',
      passwordHash,
      role: UserRole.barber,
      barberProfile: {
        create: {
          name: 'Carlos Imperial',
          commissionPercentage: 40,
        },
      },
    },
  });

  const client = await prisma.client.upsert({
    where: { phone: '5551234567' },
    update: {},
    create: {
      name: 'Juan Pérez',
      phone: '5551234567',
      email: 'juan@example.com',
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'cliente@imperialbarber.com' },
    update: {},
    create: {
      email: 'cliente@imperialbarber.com',
      passwordHash,
      role: UserRole.client,
    },
  });

  await prisma.client.update({
    where: { id: client.id },
    data: { userId: clientUser.id },
  });

  const haircut = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Corte clásico',
      price: 250,
      durationMinutes: 45,
    },
  });

  await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0000-000000000102' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Barba premium',
      price: 180,
      durationMinutes: 30,
    },
  });

  await prisma.product.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      name: 'Pomada mate',
      stock: 3,
      criticalLimit: 5,
      price: 320,
    },
  });

  const barberProfile = await prisma.barberProfile.findUnique({
    where: { userId: barberUser.id },
  });

  if (barberProfile) {
    await prisma.appointment.create({
      data: {
        clientId: client.id,
        barberId: barberProfile.id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        services: {
          create: [{ serviceId: haircut.id, priceApplied: haircut.price }],
        },
      },
    });
  }

  console.log('Seed completado:', {
    admin: admin.email,
    barber: barberUser.email,
    clientUser: clientUser.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
