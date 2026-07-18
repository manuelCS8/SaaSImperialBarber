import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';

export function RegisterPage({ onGoLogin }: { onGoLogin: () => void }) {
  const { registerClient } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await registerClient({ name, phone, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#064e3b_0%,_#020617_45%,_#000_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Imperial Barber</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Crea tu cuenta de cliente
            </h1>
            <p className="mt-4 max-w-lg text-xl text-slate-200">
              Regístrate para ver tus citas, solicitar nuevos servicios y recibir confirmaciones
              por correo cuando la barbería confirme tu cita.
            </p>
            <p className="mt-3 max-w-lg text-base text-slate-400">
              Si ya te agendaron antes, usa el mismo teléfono para vincular tu historial de citas.
            </p>
          </div>

          <Card title="Crear cuenta" subtitle="Acceso para clientes de Imperial Barber">
            <form className="space-y-4 text-base" onSubmit={handleSubmit}>
              <Input
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5551234567"
                required
              />
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
                minLength={8}
                required
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
              <p className="text-center text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                  onClick={onGoLogin}
                >
                  Inicia sesión
                </button>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
