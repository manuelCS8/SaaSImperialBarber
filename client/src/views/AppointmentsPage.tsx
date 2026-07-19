import { useEffect, useState } from 'react';
import { Badge, Button, Card, EmptyState, Input, Select } from '../components/ui';
import { AppointmentDateTimePicker } from '../components/AppointmentDateTimePicker';
import { useAuth } from '../context/AuthContext';
import {
  completeAppointment,
  createAppointment,
  getAppointments,
  getBarbers,
  getClients,
  getServices,
  updateAppointmentStatus,
} from '../services/api';
import type { Appointment, AppointmentStatus, Barber, Client, EmailNotification, Service } from '../types';
import {
  validateAppointmentDatetime,
} from '../utils/datetime';
import { formatDate, formatMoney, statusClass, statusLabel } from '../utils/format';
import {
  closeAlert,
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
  showWarningAlert,
} from '../utils/swalTheme';

type ActionKind = 'create' | 'confirm' | 'complete' | 'cancel';

async function showEmailResultAlert(notification?: EmailNotification) {
  if (!notification) {
    await showSuccessAlert('Cita confirmada', 'El estado de la cita se actualizó correctamente.');
    return;
  }

  if (notification.sent) {
    await showSuccessAlert(
      'Correo enviado',
      'La cita fue confirmada y el cliente recibió el correo de confirmación en su bandeja.'
    );
    return;
  }

  const detail =
    notification.error ??
    notification.skippedReason ??
    'No se pudo enviar el correo de confirmación.';

  await showWarningAlert(
    'Cita confirmada sin correo',
    `La cita quedó confirmada, pero el email no se envió: ${detail}`
  );
}

export function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<{ id: string; kind: ActionKind } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    clientId: '',
    barberId: '',
    serviceId: '',
    appointmentDate: '',
    notes: '',
  });

  async function loadData() {
    if (!token) return;
    setLoading(true);
    try {
      const [appointmentList, clientList, barberList, serviceList] = await Promise.all([
        getAppointments(token),
        getClients(token),
        getBarbers(token),
        getServices(),
      ]);
      setAppointments(appointmentList);
      setClients(clientList);
      setBarbers(barberList);
      setServices(serviceList);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!token || creating) return;

    const dateError = validateAppointmentDatetime(form.appointmentDate);
    if (dateError) {
      setError(dateError);
      return;
    }

    setCreating(true);
    setError('');

    try {
      await createAppointment(token, {
        clientId: form.clientId,
        barberId: form.barberId,
        serviceIds: [form.serviceId],
        appointmentDate: new Date(form.appointmentDate).toISOString(),
        notes: form.notes || undefined,
      });
      setForm({ clientId: '', barberId: '', serviceId: '', appointmentDate: '', notes: '' });
      await loadData();
      await showSuccessAlert('Cita agendada', 'La cita se registró correctamente en la agenda.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear la cita';
      setError(message);
      await showErrorAlert('No se pudo agendar', message);
    } finally {
      setCreating(false);
    }
  }

  async function changeStatus(id: string, status: AppointmentStatus) {
    if (!token || actionLoading) return;

    const kind: ActionKind = status === 'confirmed' ? 'confirm' : 'cancel';
    setActionLoading({ id, kind });
    setError('');

    if (status === 'confirmed') {
      showLoadingAlert(
        'Confirmando cita...',
        'Estamos actualizando la cita y enviando el correo al cliente. El servidor puede tardar unos segundos — no cierres esta ventana.'
      );
    }

    try {
      const updated = await updateAppointmentStatus(token, id, status);
      await loadData();

      if (status === 'confirmed') {
        closeAlert();
        await showEmailResultAlert(updated.emailNotification);
      } else if (status === 'cancelled') {
        await showSuccessAlert('Cita cancelada', 'La cita se marcó como cancelada.');
      }
    } catch (err) {
      closeAlert();
      const message = err instanceof Error ? err.message : 'No se pudo actualizar la cita';
      setError(message);
      await showErrorAlert('Error al actualizar', message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete(id: string) {
    if (!token || actionLoading) return;

    setActionLoading({ id, kind: 'complete' });
    setError('');
    showLoadingAlert(
      'Completando cita...',
      'Calculando pago y comisión del barbero. Espera un momento.'
    );

    try {
      await completeAppointment(token, id);
      await loadData();
      closeAlert();
      await showSuccessAlert(
        'Cita completada',
        'Se registró el pago y la comisión del barbero automáticamente.'
      );
    } catch (err) {
      closeAlert();
      const message = err instanceof Error ? err.message : 'No se pudo completar la cita';
      setError(message);
      await showErrorAlert('Error al completar', message);
    } finally {
      setActionLoading(null);
    }
  }

  function actionLabel(id: string, kind: ActionKind, idle: string, busy: string) {
    return actionLoading?.id === id && actionLoading.kind === kind ? busy : idle;
  }

  return (
    <div className="space-y-6">
      <Card title="Nueva cita" subtitle="Agenda un servicio para un cliente de tu barbería">
        {services.length > 0 && (
          <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-base text-slate-300">
            <p className="font-medium text-white">Servicios disponibles</p>
            <ul className="mt-2 space-y-1">
              {services.map((service) => (
                <li key={service.id}>
                  {service.name} · {formatMoney(service.price)} · {service.durationMinutes} min
                </li>
              ))}
            </ul>
          </div>
        )}
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          <Select
            label="Cliente"
            value={form.clientId}
            onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
            required
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} · {client.phone}
                {client.email ? ` · ${client.email}` : ''}
              </option>
            ))}
          </Select>

          <Select
            label="Barbero"
            value={form.barberId}
            onChange={(e) => setForm((prev) => ({ ...prev, barberId: e.target.value }))}
            required
          >
            <option value="">Seleccionar barbero</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </Select>

          <Select
            label="Servicio"
            value={form.serviceId}
            onChange={(e) => setForm((prev) => ({ ...prev, serviceId: e.target.value }))}
            required
          >
            <option value="">Seleccionar servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · {formatMoney(service.price)}
              </option>
            ))}
          </Select>

          <AppointmentDateTimePicker
            value={form.appointmentDate}
            onChange={(appointmentDate) => setForm((prev) => ({ ...prev, appointmentDate }))}
          />

          <div className="md:col-span-2">
            <Input
              label="Notas"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Preferencias del cliente, tipo de corte..."
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={creating}>
              {creating ? 'Agendando...' : 'Agendar cita'}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <Card title="Agenda" subtitle="Gestiona confirmaciones y cierre de servicios">
        {loading ? (
          <p className="text-slate-400">Cargando citas...</p>
        ) : appointments.length === 0 ? (
          <EmptyState
            title="Sin citas registradas"
            description="Crea la primera cita usando el formulario de arriba."
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const total = appointment.services.reduce(
                (sum, item) => sum + Number(item.priceApplied),
                0
              );
              const busy = actionLoading?.id === appointment.id;

              return (
                <article
                  key={appointment.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{appointment.client.name}</h3>
                        <Badge className={statusClass(appointment.status)}>
                          {statusLabel(appointment.status)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatDate(appointment.appointmentDate)} · {appointment.barber.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {appointment.services.map((item) => item.service.name).join(', ')} ·{' '}
                        {formatMoney(total)}
                      </p>
                      {appointment.client.email && (
                        <p className="mt-1 text-xs text-slate-500">{appointment.client.email}</p>
                      )}
                      {appointment.commission && (
                        <p className="mt-1 text-sm text-emerald-300">
                          Comisión: {formatMoney(appointment.commission.commissionAmount)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {appointment.status === 'scheduled' && (
                        <Button
                          variant="secondary"
                          disabled={busy}
                          onClick={() => changeStatus(appointment.id, 'confirmed')}
                        >
                          {actionLabel(appointment.id, 'confirm', 'Confirmar', 'Confirmando...')}
                        </Button>
                      )}
                      {['scheduled', 'confirmed'].includes(appointment.status) && (
                        <>
                          <Button disabled={busy} onClick={() => handleComplete(appointment.id)}>
                            {actionLabel(appointment.id, 'complete', 'Completar', 'Completando...')}
                          </Button>
                          <Button
                            variant="danger"
                            disabled={busy}
                            onClick={() => changeStatus(appointment.id, 'cancelled')}
                          >
                            {actionLabel(appointment.id, 'cancel', 'Cancelar', 'Cancelando...')}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
