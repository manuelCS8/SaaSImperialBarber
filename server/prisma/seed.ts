import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la siembra de datos (Seed)...');

  // Crear o actualizar el cliente de prueba para el equipo de QA
  const qaUser = await prisma.user.upsert({
    where: { email: 'qa.test@domain.com' }, // 👈 Email genérico para el flujo de QA
    update: {},
    create: {
      name: 'QA Tester', // 👈 Nombre del perfil de pruebas
      email: 'qa.test@domain.com',
      emailVerified: null, // Comienza como no verificado para que QA pruebe el flujo de Resend
    },
  });

  console.log(`✅ Cliente de prueba para QA listo: ${qaUser.email}`);
  console.log('🚀 Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });