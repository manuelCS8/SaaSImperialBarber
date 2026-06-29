import { useEffect, useState } from 'react';
import { Button, Card, EmptyState, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { createClient, getClients } from '../services/api';
import type { Client } from '../types';

export function ClientsPage() {
  const { token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [success, setSuccess] = useState('');

  async function loadClients() {
    if (!token) return;
    setLoading(true);
    try {
      setClients(await getClients(token));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, [token]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('El teléfono debe tener al menos 10 dígitos numéricos');
      return;
    }

    try {
      await createClient(token, { ...form, phone: digits });
      setForm({ name: '', phone: '', email: '' });
      setSuccess('Cliente guardado correctamente');
      setError('');
      await loadClients();
    } catch (err) {
      setSuccess('');
      setError(err instanceof Error ? err.message : 'No se pudo crear el cliente');
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Registrar cliente" subtitle="Agrega clientes para poder agendar citas">
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreate}>
          <Input
            label="Nombre completo"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Teléfono"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10,15}"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
            placeholder="10 dígitos"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <div className="md:col-span-3">
            <Button type="submit">Guardar cliente</Button>
          </div>
        </form>
      </Card>

      {success && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-base text-emerald-200">
          {success}
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <Card title="Clientes registrados" subtitle="Listado de clientes de tu barbería">
        {loading ? (
          <p className="text-slate-400">Cargando clientes...</p>
        ) : clients.length === 0 ? (
          <EmptyState
            title="Aún no hay clientes"
            description="Registra el primer cliente para poder agendar citas."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Teléfono</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-800/80">
                    <td className="px-3 py-3 font-medium text-white">{client.name}</td>
                    <td className="px-3 py-3 text-slate-300">{client.phone}</td>
                    <td className="px-3 py-3 text-slate-400">{client.email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
