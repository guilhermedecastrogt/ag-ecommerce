"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrders, updateOrderStatus, type Order } from "@/lib/api";

const STATUSES = ["PENDING", "PAID", "CANCELLED"];

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  PAID: "bg-green-50 text-green-700 border-green-100",
  CANCELLED: "bg-red/5 text-red/70 border-red/10",
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PedidosPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const load = () => {
    if (!accessToken) return;
    setLoading(true);
    fetchOrders(accessToken)
      .then((data) =>
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      )
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Erro"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const handleStatusChange = async (order: Order, newStatus: string) => {
    if (!accessToken || newStatus === order.status) return;
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, newStatus, accessToken);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === "ALL" ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/60 mb-1">Gestão</p>
          <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide">
            Pedidos
          </h1>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-2">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-[0.65rem] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                filterStatus === s
                  ? "bg-blue text-white border-blue"
                  : "text-blue/40 border-neutral-border hover:border-blue/30 hover:text-blue"
              }`}
            >
              {s === "ALL" ? "Todos" : s}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-neutral-light animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-border">
                  {["ID", "Usuário", "Itens", "Total", "Status", "Data"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[0.65rem] font-extrabold text-blue/40 uppercase tracking-[0.12em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-light/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-blue/50">#{o.id}</td>
                    <td className="px-5 py-3 text-blue/60 text-xs">user #{o.userId}</td>
                    <td className="px-5 py-3 text-blue/50 text-xs">{o.items?.length ?? 0}</td>
                    <td className="px-5 py-3 font-[var(--font-display)] font-extrabold text-blue">{formatBRL(o.total)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        className={`text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-full border appearance-none cursor-pointer focus:outline-none transition-all disabled:opacity-50 ${STATUS_STYLE[o.status] ?? "bg-blue/5 text-blue/50 border-blue/10"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-blue/35 text-xs">
                      {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-blue/30 text-sm">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
