import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createClientService = async (clientData: { name: string; phone: string }) => {
  const { name, phone } = clientData;

  // 1. Normalizar teléfono: Quitar espacios, guiones y cualquier carácter no numérico
  const normalizedPhone = phone.replace(/\D/g, ''); 

  // 2. Validar mínimo de 10 dígitos en el teléfono
  if (normalizedPhone.length < 10) {
    throw new Error('VALIDACION_TELEFONO_MIN_LONGITUD');
  }

  // 3. Rechazar teléfono duplicado para evitar un error genérico de la BD
  const existingClient = await prisma.client.findFirst({
    where: { phone: normalizedPhone }
  });

  if (existingClient) {
    throw new Error('CLIENTE_TELEFONO_YA_EXISTE');
  }

  // Si pasa las validaciones, creamos el cliente con el teléfono limpio
  return await prisma.client.create({
    data: {
      name,
      phone: normalizedPhone
    }
  });
};