import { AppointmentStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { calculateCommissionAmount } from '../utils/commission';

export async function listAppointments(filters?: {
  barberId?: string;
  clientId?: string;
  status?: AppointmentStatus;
}) {
  return prisma.appointment.findMany({
    where: {
      barberId: filters?.barberId,
      clientId: filters?.clientId,
      status: filters?.status,
    },
    include: {
      client: true,
      barber: true,
      services: { include: { service: true } },
      payment: true,
      commission: true,
    },
    orderBy: { appointmentDate: 'asc' },
  });
}

export async function createAppointment(input: {
  clientId: string;
  barberId: string;
  appointmentDate: Date;
  serviceIds: string[];
  notes?: string;
}) {
  const services = await prisma.service.findMany({
    where: { id: { in: input.serviceIds }, isActive: true },
  });

  if (services.length !== input.serviceIds.length) {
    throw new Error('INVALID_SERVICES');
  }

  return prisma.appointment.create({
    data: {
      clientId: input.clientId,
      barberId: input.barberId,
      appointmentDate: input.appointmentDate,
      notes: input.notes,
      services: {
        create: services.map((service) => ({
          serviceId: service.id,
          priceApplied: service.price,
        })),
      },
    },
    include: {
      client: true,
      barber: true,
      services: { include: { service: true } },
    },
  });
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      client: true,
      barber: true,
      services: { include: { service: true } },
    },
  });
}

export async function completeAppointmentAndCalculateCommission(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      barber: true,
      services: true,
      payment: true,
      commission: true,
    },
  });

  if (!appointment) {
    throw new Error('APPOINTMENT_NOT_FOUND');
  }

  if (appointment.commission) {
    throw new Error('COMMISSION_ALREADY_CALCULATED');
  }

  const serviceAmount = appointment.services.reduce(
    (total, item) => total + Number(item.priceApplied),
    0
  );

  const commissionRate = Number(appointment.barber.commissionPercentage);
  const commissionAmount = calculateCommissionAmount(serviceAmount, commissionRate);

  return prisma.$transaction(async (tx) => {
    await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.completed },
    });

    const payment = await tx.payment.create({
      data: {
        appointmentId,
        barberId: appointment.barberId,
        amount: serviceAmount,
        status: PaymentStatus.paid,
        paidAt: new Date(),
      },
    });

    const commission = await tx.commission.create({
      data: {
        appointmentId,
        barberId: appointment.barberId,
        paymentId: payment.id,
        serviceAmount,
        commissionRate,
        commissionAmount,
      },
    });

    return { payment, commission, serviceAmount, commissionAmount };
  });
}
