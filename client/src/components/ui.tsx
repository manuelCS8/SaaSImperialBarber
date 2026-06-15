import type { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl ${className}`}>
      {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      <div className={title || subtitle ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  const variants = {
    primary: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
    secondary: 'border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
    ghost: 'text-slate-300 hover:bg-slate-800',
  };

  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-400">{label}</span>
      <input
        className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-emerald-400 focus:ring ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  children,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-400">{label}</span>
      <select
        className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-emerald-400 focus:ring ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-10 text-center">
      <p className="font-medium text-slate-200">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
