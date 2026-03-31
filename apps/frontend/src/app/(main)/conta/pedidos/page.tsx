"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyOrders, Order } from "@/lib/api";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const STATUS: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PENDING:   { label: "Pendente",   dot: "bg-amber-400",  text: "text-amber-700",  bg: "bg-amber-50" },
  PAID:      { label: "Pago",       dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50" },
  CANCELLED: { label: "Cancelado",  dot: "bg-red",        text: "text-red/70",     bg: "bg-red/6" },
};

export default function PedidosPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login?redirect=/conta/pedidos");
  }, [isLoading, isAuthenticated, router]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await fetchMyOrders(accessToken);
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { if (isAuthenticated) load(); }, [isAuthenticated, load]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-blue/35 mb-1.5">
            <Link href="/" className="hover:text-blue/60 transition-colors">Início</Link>
            <span className="text-blue/20">/</span>
            <Link href="/conta" className="hover:text-blue/60 transition-colors">Conta</Link>
            <span className="text-blue/20">/</span>
            <span className="text-blue/55">Pedidos</span>
          </nav>
          <h1 className="font-[var(--font-display)] text-blue text-2xl font-extrabold uppercase tracking-wide">
            Meus Pedidos
          </h1>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-border h-[88px] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red/70 font-semibold mb-4">{error}</p>
            <button onClick={load} className="text-sm font-bold text-blue border border-blue/20 px-5 py-2.5 rounded-xl hover:bg-blue hover:text-white transition-colors">
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-blue/5 border border-blue/8 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-blue/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="font-[var(--font-display)] text-blue text-xl font-extrabold uppercase tracking-wide mb-2">Nenhum pedido</p>
            <p className="text-blue/40 text-sm mb-6">Quando você fizer uma compra, seus pedidos aparecerão aqui.</p>
            <Link href="/loja" className="inline-flex items-center gap-2 bg-blue text-white font-extrabold uppercase tracking-[0.08em] text-sm px-5 py-3 rounded-xl hover:bg-red transition-colors">
              Ir para a loja
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-2.5">
            {orders.map((order) => {
              const s = STATUS[order.status] ?? { label: order.status, dot: "bg-blue/40", text: "text-blue/60", bg: "bg-neutral-light" };
              return (
                <Link
                  key={order.id}
                  href={`/conta/pedidos/${order.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-neutral-border px-5 py-4 hover:shadow-lg hover:shadow-blue/5 hover:-translate-y-0.5 hover:border-blue/20 transition-all duration-200 group"
                >
                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${s.dot} shrink-0`} />

                  {/* ID + date */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-blue text-xs font-bold truncate">{order.id}</p>
                    <p className="text-blue/35 text-[0.7rem] mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>

                  {/* Items count */}
                  <div className="hidden sm:block text-center">
                    <p className="text-blue/60 text-sm font-semibold">{order.items?.length ?? 0}</p>
                    <p className="text-blue/30 text-[0.65rem] uppercase tracking-wider">iten{(order.items?.length ?? 0) !== 1 ? "s" : ""}</p>
                  </div>

                  {/* Status badge */}
                  <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wider ${s.bg} ${s.text}`}>
                    {s.label}
                  </div>

                  {/* Total */}
                  <div className="text-right shrink-0">
                    <span className="font-[var(--font-display)] text-blue font-extrabold text-lg tracking-wide">
                      {formatBRL(order.total)}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-blue/20 group-hover:text-blue/50 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
