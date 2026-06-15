import { useEffect, useState } from 'react';
import { Card, EmptyState, Select } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getBarberCommissions, getBarbers } from '../services/api';
import type { Barber, Commission } from '../types';
import { formatDate, formatMoney } from '../utils/format';

export function CommissionsPage() {
  const { token } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    getBarbers(token)
      .then((data) => {
        setBarbers(data);
        if (data[0]) setSelectedBarberId(data[0].id);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedBarberId) return;

    getBarberCommissions(token, selectedBarberId)
      .then(setCommissions)
      .catch((err: Error) => setError(err.message));
  }, [token, selectedBarberId]);

  const total = commissions.reduce((sum, item) => sum + Number(item.commissionAmount), 0);
  const selectedBarber = barbers.find((barber) => barber.id === selectedBarberId);

  return (
    <div className="space-y-6">
      <Card title="Comisiones por barbero" subtitle="Calculadas al completar citas con pago real">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Barbero"
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
          >
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </Select>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-sm text-slate-400">Total acumulado</p>
            <p className="mt-1 text-3xl font-bold text-emerald-300">{formatMoney(total)}</p>
            {selectedBarber && (
              <p className="mt-2 text-sm text-slate-400">
                Tasa base: {Number(selectedBarber.commissionPercentage)}%
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card title="Historial de comisiones">
        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-400">Cargando comisiones...</p>
        ) : commissions.length === 0 ? (
          <EmptyState
            title="Sin comisiones registradas"
            description="Completa una cita desde la agenda para generar la primera comisión."
          />
        ) : (
          <div className="space-y-3">
            {commissions.map((commission) => (
              <article
                key={commission.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {commission.appointment.client.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {commission.appointment.services.map((item) => item.service.name).join(', ')}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(commission.calculatedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-300">
                      {formatMoney(commission.commissionAmount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Servicio: {formatMoney(commission.serviceAmount)} ·{' '}
                      {Number(commission.commissionRate)}%
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
