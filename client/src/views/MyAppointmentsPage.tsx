import { useEffect, useState } from 'react';
import { Badge, Button, Card, EmptyState, Input, Select } from '../components/ui';
import { AppointmentDateTimePicker } from '../components/AppointmentDateTimePicker';
import { useAuth } from '../context/AuthContext';
import {
  createAppointment,
  getAppointments,
  getBarbers,
  getServices,
} from '../services/api';
import type { Appointment, Barber, Service } from '../types';
import { validateAppointmentDatetime } from '../utils/datetime';
import { formatDate, formatMoney, statusClass, statusLabel } from '../utils/format';
import { showErrorAlert, showSuccessAlert } from '../utils/swalTheme';

export function MyAppointmentsPage() {
  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    barberId: '',
    serviceId: '',
    appointmentDate: '',
    notes: '',
  });

  async function loadData() {
    if (!token) return;
    setLoading(true);
    try {
      const [appointmentList, barberList, serviceList] = await Promise.all([
        getAppointments(token),
        getBarbers(token),
        getServices(),
      ]);
      setAppointments(appointmentList);
      setBarbers(barberList);
      setServices(serviceList);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tus citas');
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
        clientId: user?.clientProfile?.id ?? '',
        barberId: form.barberId,
        serviceIds: [form.serviceId],
        appointmentDate: new Date(form.appointmentDate).toISOString(),
        notes: form.notes || undefined,
      });
      setForm({ barberId: '', serviceId: '', appointmentDate: '', notes: '' });
      await loadData();
      await showSuccessAlert(
        'Cita solicitada',
        'Tu cita quedó registrada. La barbería la confirmará y te llegará un correo.'
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo solicitar la cita';
      setError(message);
      await showErrorAlert('No se pudo agendar', message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card
        title={`Hola, ${user?.clientProfile?.name ?? 'cliente'}`}
        subtitle="Aquí ves solo tus citas en Imperial Barber"
      >
        <p className="text-sm text-slate-400">
          Teléfono registrado: {user?.clientProfile?.phone ?? '—'} · {user?.email}
        </p>
      </Card>

      <Card title="Solicitar cita" subtitle="Elige barbero, servicio y horario disponible">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
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
              label="Notas (opcional)"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Tipo de corte, preferencias..."
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={creating}>
              {creating ? 'Enviando solicitud...' : 'Solicitar cita'}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <Card title="Mis citas" subtitle="Estados: programada, confirmada, completada o cancelada">
        {loading ? (
          <p className="text-slate-400">Cargando citas...</p>
        ) : appointments.length === 0 ? (
          <EmptyState
            title="Aún no tienes citas"
            description="Solicita tu primera cita con el formulario de arriba o pide a recepción que te agenden con tu teléfono."
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const total = appointment.services.reduce(
                (sum, item) => sum + Number(item.priceApplied),
                0
              );

              return (
                <article
                  key={appointment.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{appointment.barber.name}</h3>
                        <Badge className={statusClass(appointment.status)}>
                          {statusLabel(appointment.status)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {appointment.services.map((item) => item.service.name).join(', ')} ·{' '}
                        {formatMoney(total)}
                      </p>
                      {appointment.notes && (
                        <p className="mt-2 text-xs text-slate-500">Notas: {appointment.notes}</p>
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
