import type { AppointmentStatus } from '../types';

const labels: Record<AppointmentStatus, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
  completed: 'Completada',
};

const styles: Record<AppointmentStatus, string> = {
  scheduled: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  confirmed: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  cancelled: 'bg-red-500/15 text-red-300 ring-red-500/30',
  no_show: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  completed: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
};

export function formatMoney(value: string | number) {
  const amount = Number(value);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function statusLabel(status: AppointmentStatus) {
  return labels[status];
}

export function statusClass(status: AppointmentStatus) {
  return styles[status];
}
