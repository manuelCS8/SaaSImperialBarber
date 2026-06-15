import { useEffect, useState } from 'react';
import { Badge, Card, EmptyState } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getCriticalInventory } from '../services/api';
import type { Product } from '../types';
import { formatMoney } from '../utils/format';

export function InventoryPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    getCriticalInventory(token)
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <Card
        title="Inventario crítico"
        subtitle="Productos en o por debajo del umbral mínimo"
      >
        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-400">Revisando stock...</p>
        ) : products.length === 0 ? (
          <EmptyState
            title="Sin alertas de inventario"
            description="Todos los productos están por encima del límite crítico."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Precio: {formatMoney(product.price)}
                    </p>
                  </div>
                  <Badge className="bg-amber-500/15 text-amber-300 ring-amber-500/30">
                    Crítico
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Stock: <strong className="text-amber-300">{product.stock}</strong>
                  </span>
                  <span className="text-slate-500">Mínimo: {product.criticalLimit}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
