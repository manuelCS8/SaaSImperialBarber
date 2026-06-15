import { useEffect, useState } from 'react';
import { Badge, Button, Card, EmptyState, Input, Select } from '../components/ui';
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
import type { Appointment, AppointmentStatus, Barber, Client, Service } from '../types';
import { formatDate, formatMoney, statusClass, statusLabel } from '../utils/format';

export function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    if (!token) return;

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cita');
    }
  }

  async function changeStatus(id: string, status: AppointmentStatus) {
    if (!token) return;
    try {
      await updateAppointmentStatus(token, id, status);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la cita');
    }
  }

  async function handleComplete(id: string) {
    if (!token) return;
    try {
      await completeAppointment(token, id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la cita');
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Nueva cita" subtitle="Agenda un servicio para un cliente">
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

          <Input
            label="Fecha y hora"
            type="datetime-local"
            value={form.appointmentDate}
            onChange={(e) => setForm((prev) => ({ ...prev, appointmentDate: e.target.value }))}
            required
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
            <Button type="submit">Agendar cita</Button>
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
                      {appointment.commission && (
                        <p className="mt-1 text-sm text-emerald-300">
                          Comisión: {formatMoney(appointment.commission.commissionAmount)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {appointment.status === 'scheduled' && (
                        <Button variant="secondary" onClick={() => changeStatus(appointment.id, 'confirmed')}>
                          Confirmar
                        </Button>
                      )}
                      {['scheduled', 'confirmed'].includes(appointment.status) && (
                        <>
                          <Button onClick={() => handleComplete(appointment.id)}>
                            Completar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => changeStatus(appointment.id, 'cancelled')}
                          >
                            Cancelar
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
