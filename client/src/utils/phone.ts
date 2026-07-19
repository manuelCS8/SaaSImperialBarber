export const PHONE_LENGTH = 10;

export function normalizePhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, PHONE_LENGTH);
}

export function validatePhone10(phone: string): string | null {
  const digits = normalizePhoneInput(phone);
  if (digits.length !== PHONE_LENGTH) {
    return `El teléfono debe tener exactamente ${PHONE_LENGTH} dígitos`;
  }
  return null;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhoneInput(phone);
  if (digits.length !== PHONE_LENGTH) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}
