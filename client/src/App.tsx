import { useState } from 'react';
import { MobileNav, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { useAuth } from './context/AuthContext';
import type { ViewId } from './types';
import { AppointmentsPage } from './views/AppointmentsPage';
import { ClientsPage } from './views/ClientsPage';
import { CommissionsPage } from './views/CommissionsPage';
import { DashboardPage } from './views/DashboardPage';
import { InventoryPage } from './views/InventoryPage';
import { LoginPage } from './views/LoginPage';

const viewMeta: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Resumen operativo de la barbería',
  },
  appointments: {
    title: 'Citas',
    subtitle: 'Agenda, confirmaciones y cierre de servicios',
  },
  clients: {
    title: 'Clientes',
    subtitle: 'Registro centralizado para citas e historial',
  },
  inventory: {
    title: 'Inventario',
    subtitle: 'Alertas de stock crítico en tiempo real',
  },
  commissions: {
    title: 'Comisiones',
    subtitle: 'Pagos y porcentajes generados por servicio',
  },
};

function AppShell() {
  const [view, setView] = useState<ViewId>('dashboard');
  const meta = viewMeta[view];

  function renderView() {
    switch (view) {
      case 'dashboard':
        return <DashboardPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'commissions':
        return <CommissionsPage />;
      default:
        return <DashboardPage />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar active={view} onChange={setView} />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar title={meta.title} subtitle={meta.subtitle} />
          <MobileNav active={view} onChange={setView} />
          <main className="flex-1 px-6 py-6">{renderView()}</main>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { token } = useAuth();
  return token ? <AppShell /> : <LoginPage />;
}

export default App;
