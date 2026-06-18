import { useEffect, useState } from 'react';
import { Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import {
  getAppointments,
  getBarberCommissions,
  getBarbers,
  getClients,
  getCriticalInventory,
  getHealth,
} from '../services/api';
import { formatMoney } from '../utils/format';

export function DashboardPage() {
  const { token } = useAuth();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    appointments: 0,
    confirmed: 0,
    clients: 0,
    critical: 0,
    commissionsTotal: 0,
  });

  useEffect(() => {
    getHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      getAppointments(token),
      getClients(token),
      getCriticalInventory(token),
      getBarbers(token),
    ])
      .then(async ([appointments, clients, critical, barbers]) => {
        let commissionsTotal = 0;

        if (barbers[0]) {
          const commissions = await getBarberCommissions(token, barbers[0].id);
          commissionsTotal = commissions.reduce(
            (sum, item) => sum + Number(item.commissionAmount),
            0
          );
        }

        setStats({
          appointments: appointments.length,
          confirmed: appointments.filter((a) => a.status === 'confirmed').length,
          clients: clients.length,
          critical: critical.length,
          commissionsTotal,
        });
      })
      .catch(() => {
        setStats({ appointments: 0, confirmed: 0, clients: 0, critical: 0, commissionsTotal: 0 });
      });
  }, [token]);

  const cards = [
    { label: 'Citas totales', value: stats.appointments, tone: 'text-white' },
    { label: 'Confirmadas', value: stats.confirmed, tone: 'text-sky-300' },
    { label: 'Clientes', value: stats.clients, tone: 'text-emerald-300' },
    { label: 'Stock crítico', value: stats.critical, tone: 'text-amber-300' },
    { label: 'Comisiones barbero', value: formatMoney(stats.commissionsTotal), tone: 'text-emerald-300' },
  ];

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border px-4 py-3 text-sm ${
          apiOnline
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            : apiOnline === false
              ? 'border-red-500/30 bg-red-500/10 text-red-200'
              : 'border-slate-700 bg-slate-900 text-slate-400'
        }`}
      >
        API: {apiOnline ? 'Online' : apiOnline === false ? 'Offline — revisa el backend en Render' : 'Verificando...'}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.tone}`}>{card.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Flujo MVP activo"
          subtitle="Lo que ya puedes demostrar en local"
        >
          <ol className="space-y-3 text-sm text-slate-300">
            <li>1. Registrar o seleccionar un cliente</li>
            <li>2. Crear una cita con barbero y servicio</li>
            <li>3. Confirmar la cita desde la agenda</li>
            <li>4. Completar la cita y calcular comisión automática</li>
            <li>5. Revisar inventario crítico y comisiones generadas</li>
          </ol>
        </Card>

        <Card title="Propuesta de valor" subtitle="SaaS Imperial Barber">
          <p className="text-sm leading-6 text-slate-300">
            Centraliza la agenda, elimina cuadernos físicos y reduce tiempos muertos con
            confirmaciones activas. El panel conecta frontend React con APIs Express + Prisma
            sobre PostgreSQL.
          </p>
        </Card>
      </div>
    </div>
  );
}
