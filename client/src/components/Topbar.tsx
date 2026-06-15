import { useAuth } from '../context/AuthContext';
import { Button } from './ui';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-900/70 px-6 py-5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-right">
            <p className="text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs capitalize text-emerald-400">{user?.role.replace('_', ' ')}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
