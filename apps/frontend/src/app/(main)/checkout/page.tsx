"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { checkout } from "@/lib/api";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const SHIPPING_FEE = 29.9;
const STATES = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

interface Address {
  name: string; street: string; number: string;
  neighborhood: string; city: string; state: string; zipCode: string;
}

function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
      done ? "bg-green-600 text-white" : active ? "bg-blue text-white" : "bg-neutral-border text-blue/40"
    }`}>
      {done ? (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : n}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, accessToken, user, isLoading } = useAuth();

  const [address, setAddress] = useState<Address>({
    name: "", street: "", number: "", neighborhood: "", city: "", state: "", zipCode: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login?redirect=/checkout");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && items.length === 0) router.push("/loja");
  }, [isLoading, isAuthenticated, items.length, router]);

  useEffect(() => {
    if (user) setAddress((a) => ({ ...a, name: user.name }));
  }, [user]);

  const set = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setError("");
    setSubmitting(true);
    try {
      const order = await checkout(
        { items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })), address },
        accessToken
      );
      clearCart();
      router.push(`/checkout/confirmacao?orderId=${order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao processar pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const total = totalPrice + SHIPPING_FEE;

  const inputClass = "w-full bg-white border border-neutral-border rounded-xl px-4 py-3 text-sm text-blue placeholder-blue/25 focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/8 transition-all";
  const labelClass = "block text-[0.68rem] font-extrabold text-blue/45 uppercase tracking-[0.12em] mb-1.5";

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-blue/35 mb-3">
            <Link href="/" className="hover:text-blue/60 transition-colors">Início</Link>
            <span className="text-blue/20">/</span>
            <Link href="/carrinho" className="hover:text-blue/60 transition-colors">Carrinho</Link>
            <span className="text-blue/20">/</span>
            <span className="text-blue/55">Checkout</span>
          </nav>

          {/* Step indicators */}
          <div className="flex items-center gap-3">
            <StepBadge n={1} active={false} done={true} />
            <span className="text-xs font-bold text-blue/40">Carrinho</span>
            <div className="flex-1 h-[1px] bg-neutral-border max-w-[60px]" />
            <StepBadge n={2} active={true} done={false} />
            <span className="text-xs font-bold text-blue">Endereço</span>
            <div className="flex-1 h-[1px] bg-neutral-border max-w-[60px]" />
            <StepBadge n={3} active={false} done={false} />
            <span className="text-xs font-bold text-blue/40">Confirmação</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red/5 border border-red/15 text-red text-sm px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            {/* Address form */}
            <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue/8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <h2 className="font-[var(--font-display)] text-blue text-lg font-extrabold uppercase tracking-wide">
                  Endereço de entrega
                </h2>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Nome do destinatário</label>
                  <input required value={address.name} onChange={set("name")} placeholder="João da Silva" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CEP</label>
                  <input required value={address.zipCode} onChange={set("zipCode")} placeholder="00000-000" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <select required value={address.state} onChange={set("state")} className={inputClass + " bg-white"}>
                    <option value="">Selecione</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Cidade</label>
                  <input required value={address.city} onChange={set("city")} placeholder="Goiânia" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Bairro</label>
                  <input required value={address.neighborhood} onChange={set("neighborhood")} placeholder="Setor Bueno" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Logradouro</label>
                  <input required value={address.street} onChange={set("street")} placeholder="Rua das Flores" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Número</label>
                  <input required value={address.number} onChange={set("number")} placeholder="123" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Order summary — dark */}
            <div className="lg:col-span-1">
              <div className="bg-[#001429] rounded-2xl overflow-hidden sticky top-24">
                <div className="px-6 py-5 border-b border-white/[0.06]">
                  <h2 className="font-[var(--font-display)] text-white text-sm font-extrabold uppercase tracking-[0.15em]">
                    Resumo do pedido
                  </h2>
                </div>

                <div className="px-6 py-4 space-y-2.5 border-b border-white/[0.06]">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-white/40 truncate max-w-[160px]">
                        <span className="text-white/60 font-bold">{item.quantity}×</span> {item.name}
                      </span>
                      <span className="text-white/60 font-semibold shrink-0 ml-2">{formatBRL(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 space-y-2.5">
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Subtotal</span>
                    <span className="text-white/60 font-semibold">{formatBRL(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Frete</span>
                    <span className="text-white/60 font-semibold">{formatBRL(SHIPPING_FEE)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                    <span className="font-[var(--font-display)] text-white font-extrabold uppercase tracking-wider text-sm">Total</span>
                    <span className="font-[var(--font-display)] text-white font-extrabold text-2xl">{formatBRL(total)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-red text-white font-extrabold uppercase tracking-[0.1em] text-sm py-4 rounded-xl hover:bg-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Confirmar pedido
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
