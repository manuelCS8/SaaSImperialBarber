import { useMemo } from 'react';
import { Select } from './ui';
import {
  combineDatetimeLocal,
  formatSelectedAppointmentLabel,
  getAvailableTimeSlots,
  getMaxDateValue,
  getMinDateValue,
  splitDatetimeLocal,
} from '../utils/datetime';

export function AppointmentDateTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { date, time } = splitDatetimeLocal(value);
  const timeSlots = useMemo(() => getAvailableTimeSlots(date), [date]);

  function updateDate(nextDate: string) {
    const slots = getAvailableTimeSlots(nextDate);
    const nextTime = time && slots.includes(time) ? time : (slots[0] ?? '');
    onChange(combineDatetimeLocal(nextDate, nextTime));
  }

  function updateTime(nextTime: string) {
    onChange(combineDatetimeLocal(date, nextTime));
  }

  return (
    <div className="md:col-span-2 space-y-3">
      <p className="text-sm text-slate-400">Fecha y hora de la cita</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Fecha</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-emerald-400 focus:ring [color-scheme:dark]"
            value={date}
            min={getMinDateValue()}
            max={getMaxDateValue()}
            onChange={(e) => updateDate(e.target.value)}
            required
          />
        </label>

        <Select
          label="Horario"
          value={time}
          onChange={(e) => updateTime(e.target.value)}
          required
          disabled={!date}
        >
          <option value="">{date ? 'Seleccionar hora' : 'Primero elige fecha'}</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </Select>
      </div>
      <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
        {formatSelectedAppointmentLabel(value)}
      </p>
      <p className="text-xs text-slate-500">Horario de barbería: 9:00 a 20:00 · bloques de 30 min</p>
    </div>
  );
}
