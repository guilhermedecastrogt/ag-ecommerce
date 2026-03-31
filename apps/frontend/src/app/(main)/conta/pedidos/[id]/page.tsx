"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyOrders, cancelOrder, Order } from "@/lib/api";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PENDING:   { label: "Pendente",   dot: "bg-amber-400",  text: "text-amber-700",  bg: "bg-amber-50 border-amber-100" },
  PAID:      { label: "Pago",       dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50 border-green-100" },
  CANCELLED: { label: "Cancelado",  dot: "bg-red",        text: "text-red/70",     bg: "bg-red/5 border-red/10" },
};

export default function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading, accessToken } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    fetchMyOrders(accessToken)
      .then((orders) => {
        const found = orders.find((o) => o.id === id);
        if (found) setOrder(found);
        else setError("Pedido não encontrado.");
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Erro ao carregar pedido."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, accessToken, id]);

  const handleCancel = async () => {
    if (!accessToken || !order || !confirm("Cancelar este pedido?")) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(order.id, accessToken);
      setOrder(updated);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao cancelar.");
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center gap-4">
        <p className="text-red/70 font-semibold">{error || "Pedido não encontrado."}</p>
        <Link href="/conta/pedidos" className="text-sm font-bold text-blue border border-blue/20 px-5 py-2.5 rounded-xl hover:bg-blue hover:text-white transition-colors">
          Voltar
        </Link>
      </div>
    );
  }

  const s = STATUS[order.status] ?? { label: order.status, dot: "bg-blue/40", text: "text-blue/60", bg: "bg-neutral-light border-neutral-border" };

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
            <Link href="/conta/pedidos" className="hover:text-blue/60 transition-colors">Pedidos</Link>
            <span className="text-blue/20">/</span>
            <span className="text-blue/55 truncate max-w-[100px]">{order.id}</span>
          </nav>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-[var(--font-display)] text-blue text-xl font-extrabold uppercase tracking-wide mb-0.5">
                Detalhe do Pedido
              </h1>
              <p className="font-mono text-blue/35 text-xs">{order.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wider border ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </div>
              {order.status === "PENDING" && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="text-[0.7rem] font-bold text-red/50 hover:text-red transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelando..." : "Cancelar pedido"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid sm:grid-cols-2 gap-5">
        {/* Items */}
        <div className="sm:col-span-2 bg-white rounded-xl border border-neutral-border overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-border flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue/6 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            <h2 className="font-[var(--font-display)] text-blue text-sm font-extrabold uppercase tracking-wide">Itens do pedido</h2>
          </div>
          <div className="divide-y divide-neutral-border">
            {order.items?.map((item) => (
              <div key={item.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blue text-sm truncate">{item.name}</p>
                  <p className="text-blue/35 text-xs mt-0.5">{item.quantity} × {formatBRL(item.price)}</p>
                </div>
                <span className="font-[var(--font-display)] text-blue font-extrabold text-base shrink-0">
                  {formatBRL(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-border">
            <h2 className="font-[var(--font-display)] text-blue text-sm font-extrabold uppercase tracking-wide">Valores</h2>
          </div>
          <div className="px-5 py-5 space-y-2.5">
            {[
              { label: "Subtotal", value: formatBRL(order.subTotal) },
              { label: "Frete", value: formatBRL(order.shippingFee) },
              ...(order.discount > 0 ? [{ label: "Desconto", value: `−${formatBRL(order.discount)}`, green: true }] : []),
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-blue/45">{row.label}</span>
                <span className={`font-semibold ${(row as { green?: boolean }).green ? "text-green-600" : "text-blue/70"}`}>{row.value}</span>
              </div>
            ))}
            <div className="border-t border-neutral-border pt-3 flex justify-between">
              <span className="font-[var(--font-display)] text-blue font-extrabold uppercase tracking-wide text-sm">Total</span>
              <span className="font-[var(--font-display)] text-blue font-extrabold text-xl">{formatBRL(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-border">
            <h2 className="font-[var(--font-display)] text-blue text-sm font-extrabold uppercase tracking-wide">Endereço</h2>
          </div>
          <div className="px-5 py-5">
            {order.addressSnapshot ? (
              <address className="not-italic text-sm text-blue/55 space-y-1 leading-relaxed">
                <p className="font-bold text-blue">{order.addressSnapshot.name}</p>
                <p>{order.addressSnapshot.street}, {order.addressSnapshot.number}</p>
                <p>{order.addressSnapshot.neighborhood}</p>
                <p>{order.addressSnapshot.city} — {order.addressSnapshot.state}</p>
                <p>CEP: {order.addressSnapshot.zipCode}</p>
              </address>
            ) : (
              <p className="text-blue/30 text-sm italic">Endereço não disponível</p>
            )}
            <p className="text-blue/25 text-[0.65rem] mt-4 pt-4 border-t border-neutral-border">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Back link */}
        <div className="sm:col-span-2">
          <Link href="/conta/pedidos" className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-blue/35 hover:text-blue transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Voltar aos pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
