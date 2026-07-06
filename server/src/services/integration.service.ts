import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResendStatus = async (email: string) => {
  // Buscamos al usuario por su correo electrónico
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      emailVerified: true, // Usamos este campo para simular o verificar el flujo de Resend
    },
  });

  if (!user) {
    return null;
  }

  // Mapeamos el estado basado en si ya verificó su correo o no
  const status = user.emailVerified ? 'VERIFIED' : 'PENDING';

  return {
    email: user.email,
    integration: 'RESEND',
    status: status,
    updatedAt: new Date().toISOString(), // Simulación de la última actualización para la demo
  };
};