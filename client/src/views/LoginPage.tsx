import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@imperialbarber.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#064e3b_0%,_#020617_45%,_#000_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Premium SaaS</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Gestión inteligente para barberías premium
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-300">
              Agenda, clientes, comisiones e inventario en un solo panel. Diseñado para reducir
              no-shows y optimizar cada cita.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Agenda digital', 'Comisiones reales', 'Stock crítico'].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card title="Iniciar sesión" subtitle="Accede al panel de administración">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar al panel'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
