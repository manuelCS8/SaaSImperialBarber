export function toDatetimeLocalValue(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function getMinAppointmentDatetime(): string {
  return toDatetimeLocalValue(new Date());
}

export function getMaxAppointmentDatetime(): string {
  const max = new Date();
  max.setFullYear(max.getFullYear() + 1);
  return toDatetimeLocalValue(max);
}

export function validateAppointmentDatetime(value: string): string | null {
  if (!value) return 'Selecciona fecha y hora';

  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) return 'Fecha u hora inválida';

  const now = new Date();
  if (selected.getTime() < now.getTime() - 60_000) {
    return 'No puedes agendar en el pasado';
  }

  const max = new Date();
  max.setFullYear(max.getFullYear() + 1);
  if (selected > max) {
    return 'La cita no puede ser más de 1 año adelante';
  }

  return null;
}
