import { Request, Response, NextFunction } from 'express';
import { AppointmentStatus, UserRole } from '@prisma/client';
import * as appointmentService from '../services/appointment.service';
import * as clientAuthService from '../services/client-auth.service';
import { sendAppointmentConfirmationEmail } from '../services/email.service';
import { sendError, sendSuccess } from '../utils/response';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: {
      barberId?: string;
      clientId?: string;
      status?: AppointmentStatus;
    } = {
      barberId: req.query.barberId as string | undefined,
      status: req.query.status as AppointmentStatus | undefined,
    };

    if (req.user?.role === UserRole.client) {
      filters.clientId = await clientAuthService.requireClientIdForUser(req.user.sub);
    } else {
      filters.clientId = req.query.clientId as string | undefined;
    }

    const appointments = await appointmentService.listAppointments(filters);

    return sendSuccess(res, appointments);
  } catch (error) {
    return next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { clientId, barberId, appointmentDate, serviceIds, notes } = req.body;

    if (!barberId || !appointmentDate || !Array.isArray(serviceIds)) {
      return sendError(res, 'barberId, appointmentDate y serviceIds son obligatorios', 400);
    }

    let resolvedClientId = clientId as string | undefined;
    if (req.user?.role === UserRole.client) {
      resolvedClientId = await clientAuthService.requireClientIdForUser(req.user.sub);
    } else if (!resolvedClientId) {
      return sendError(res, 'clientId, barberId, appointmentDate y serviceIds son obligatorios', 400);
    }

    const appointment = await appointmentService.createAppointment({
      clientId: resolvedClientId,
      barberId,
      appointmentDate: new Date(appointmentDate),
      serviceIds,
      notes,
    });

    return sendSuccess(res, appointment, 'Cita creada', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'status es obligatorio', 400);
    }

    const appointment = await appointmentService.updateAppointmentStatus(String(req.params.id), status);

    let emailNotification;
    if (status === AppointmentStatus.confirmed) {
      emailNotification = await sendAppointmentConfirmationEmail({
        clientName: appointment.client.name,
        clientEmail: appointment.client.email,
        barberName: appointment.barber.name,
        appointmentDate: appointment.appointmentDate,
        services: appointment.services.map((item) => item.service.name),
      });
    }

    return sendSuccess(res, { ...appointment, emailNotification }, 'Estado de cita actualizado');
  } catch (error) {
    return next(error);
  }
}

export async function complete(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await appointmentService.completeAppointmentAndCalculateCommission(String(req.params.id));
    return sendSuccess(res, result, 'Cita completada y comisión calculada');
  } catch (error) {
    return next(error);
  }
}
