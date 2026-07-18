import type { ViewId } from '../types';

const allItems: Array<{ id: ViewId; label: string; icon: string; roles: string[] }> = [
  { id: 'dashboard', label: 'Dashboard', icon: '◆', roles: ['admin_owner', 'barber'] },
  { id: 'appointments', label: 'Citas', icon: '✂', roles: ['admin_owner', 'barber'] },
  { id: 'clients', label: 'Clientes', icon: '◎', roles: ['admin_owner', 'barber'] },
  { id: 'inventory', label: 'Inventario', icon: '▣', roles: ['admin_owner', 'barber'] },
  { id: 'commissions', label: 'Comisiones', icon: '₿', roles: ['admin_owner', 'barber'] },
  { id: 'my-appointments', label: 'Mis citas', icon: '✂', roles: ['client'] },
];

export function getNavItems(role?: string) {
  const resolvedRole = role ?? 'admin_owner';
  return allItems.filter((item) => item.roles.includes(resolvedRole));
}

export function Sidebar({
  active,
  onChange,
  role,
}: {
  active: ViewId;
  onChange: (view: ViewId) => void;
  role?: string;
}) {
  const items = getNavItems(role);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900/60 p-5 lg:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Imperial Barber</p>
        <h1 className="mt-1 text-xl font-bold text-white">
          {role === 'client' ? 'Portal Cliente' : 'SaaS Panel'}
        </h1>
      </div>

      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              active === item.id
                ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav({
  active,
  onChange,
  role,
}: {
  active: ViewId;
  onChange: (view: ViewId) => void;
  role?: string;
}) {
  const items = getNavItems(role);

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-800 bg-slate-900/80 px-4 py-3 lg:hidden">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
            active === item.id
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
