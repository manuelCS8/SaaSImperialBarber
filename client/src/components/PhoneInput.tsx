import { Input } from './ui';
import { normalizePhoneInput, PHONE_LENGTH } from '../utils/phone';

export function PhoneInput({
  label = 'Teléfono',
  value,
  onChange,
  required,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const digits = normalizePhoneInput(value);

  return (
    <div>
      <Input
        label={label}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={digits}
        onChange={(e) => onChange(normalizePhoneInput(e.target.value))}
        placeholder="5512345678"
        maxLength={PHONE_LENGTH}
        required={required}
      />
      <p className="mt-1 text-xs text-slate-500">
        {digits.length}/{PHONE_LENGTH} dígitos · solo números, sin espacios
      </p>
    </div>
  );
}
