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

export function getMinDateValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getMaxDateValue(): string {
  const max = new Date();
  max.setFullYear(max.getFullYear() + 1);
  return max.toISOString().slice(0, 10);
}

export const APPOINTMENT_TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 20; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 20 && minute === 30) break;
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
})();

export function splitDatetimeLocal(value: string): { date: string; time: string } {
  if (!value) return { date: '', time: '' };
  const [date, timePart] = value.split('T');
  return { date: date ?? '', time: (timePart ?? '').slice(0, 5) };
}

export function combineDatetimeLocal(date: string, time: string): string {
  if (!date || !time) return '';
  return `${date}T${time}`;
}

export function getAvailableTimeSlots(selectedDate: string): string[] {
  if (!selectedDate) return APPOINTMENT_TIME_SLOTS;

  const today = getMinDateValue();
  if (selectedDate !== today) return APPOINTMENT_TIME_SLOTS;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return APPOINTMENT_TIME_SLOTS.filter((slot) => {
    const [hour, minute] = slot.split(':').map(Number);
    return hour * 60 + minute > nowMinutes;
  });
}

export function formatSelectedAppointmentLabel(value: string): string {
  if (!value) return 'Selecciona fecha y horario';
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) return 'Fecha u hora inválida';

  return selected.toLocaleString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
