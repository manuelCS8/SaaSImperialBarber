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
import { MyAppointmentsPage } from './views/MyAppointmentsPage';
import { RegisterPage } from './views/RegisterPage';

const staffViewMeta: Record<Exclude<ViewId, 'my-appointments'>, { title: string; subtitle: string }> = {
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
  const { user, isClient } = useAuth();
  const [view, setView] = useState<ViewId>(isClient ? 'my-appointments' : 'dashboard');

  const meta = isClient
    ? { title: 'Mis citas', subtitle: 'Portal de cliente Imperial Barber' }
    : staffViewMeta[view as Exclude<ViewId, 'my-appointments'>];

  function renderView() {
    if (isClient) {
      return <MyAppointmentsPage />;
    }

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
        <Sidebar active={view} onChange={setView} role={user?.role} />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar title={meta.title} subtitle={meta.subtitle} />
          <MobileNav active={view} onChange={setView} role={user?.role} />
          <main className="flex-1 px-6 py-6">{renderView()}</main>
        </div>
      </div>
    </div>
  );
}

type AuthScreen = 'login' | 'register';

function App() {
  const { token } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (token) {
    return <AppShell />;
  }

  if (authScreen === 'register') {
    return <RegisterPage onGoLogin={() => setAuthScreen('login')} />;
  }

  return <LoginPage onGoRegister={() => setAuthScreen('register')} />;
}

export default App;
