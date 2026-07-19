export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function validateClientName(name: string): void {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres');
  }
  if (!/^[\p{L}\s'.-]+$/u.test(trimmed)) {
    throw new Error('El nombre solo puede contener letras y espacios');
  }
}

export function validatePhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.length !== 10) {
    throw new Error('El teléfono debe tener exactamente 10 dígitos');
  }
  return normalized;
}

export function validateAppointmentDate(date: Date): void {
  const now = new Date();
  if (date.getTime() < now.getTime() - 60_000) {
    throw new Error('No puedes agendar citas en fechas u horas pasadas');
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  if (date > maxDate) {
    throw new Error('La cita no puede ser más de 1 año en el futuro');
  }
}
