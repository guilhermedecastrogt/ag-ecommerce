"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ── Types ─────────────────────────────────────── */
interface CartItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  weight: number;   // kg
  width: number;    // cm
  height: number;   // cm
  length: number;   // cm
}

interface FreightOption {
  id: number;
  name: string;
  price: string | null;
  custom_price: string | null;
  delivery_time: number;
  company: string;
  error: string | null;
}

/* ── Demo cart (replace with real cart state/localStorage later) ── */
const DEMO_CART: CartItem[] = [
  { id: 1, name: "Injetor Common Rail Bosch CRI2-16", sku: "0445120215", price: 1849.90, quantity: 1, weight: 0.8, width: 20, height: 10, length: 15 },
  { id: 5, name: "Sensor de Pressão Rail Delphi",      sku: "9307Z521A",  price: 489.90,  quantity: 1, weight: 0.2, width: 10, height: 8,  length: 8  },
];

const FROM_POSTAL_CODE = "74000000"; // CEP da Águia Diesel (Goiânia-GO)

function formatBRL(v: number | string) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function maskCEP(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

/* ── Checkout Page ─────────────────────────────── */
export default function CheckoutPage() {
  const router = useRouter();

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({ rua: "", numero: "", bairro: "", cidade: "", estado: "" });
  const [freightOptions, setFreightOptions] = useState<FreightOption[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(null);
  const [loadingFreight, setLoadingFreight] = useState(false);
  const [freightError, setFreightError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subtotal = DEMO_CART.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = selectedFreight ? parseFloat(selectedFreight.custom_price ?? selectedFreight.price ?? "0") : 0;
  const total = subtotal + shippingFee;

  /* ── Calculate freight ──────────────────────── */
  async function handleCalculateFreight() {
    if (cep.length !== 8) {
      setFreightError("Digite um CEP válido com 8 dígitos.");
      return;
    }
    setFreightError("");
    setFreightOptions([]);
    setSelectedFreight(null);
    setLoadingFreight(true);

    try {
      const res = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPostalCode: FROM_POSTAL_CODE,
          toPostalCode: cep,
          products: DEMO_CART.map((item) => ({
            weight: item.weight,
            width: item.width,
            height: item.height,
            length: item.length,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Erro ao calcular frete.");
      }

      const data: FreightOption[] = await res.json();
      const available = data.filter((o) => !o.error && o.price !== null);
      if (available.length === 0) {
        setFreightError("Nenhuma opção de frete disponível para este CEP.");
      }
      setFreightOptions(data);
    } catch (e: unknown) {
      setFreightError(e instanceof Error ? e.message : "Erro ao calcular frete.");
    } finally {
      setLoadingFreight(false);
    }
  }

  /* ── Submit order ───────────────────────────── */
  async function handleSubmitOrder() {
    if (!selectedFreight) {
      setSubmitError("Selecione uma opção de frete.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: DEMO_CART.map((i) => ({
            productId: i.id,
            name: i.name,
            sku: i.sku,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingFee,
          discount: 0,
          addressSnapshot: {
            postalCode: cep,
            rua: address.rua,
            numero: address.numero,
            bairro: address.bairro,
            cidade: address.cidade,
            estado: address.estado,
            carrier: selectedFreight.company,
            shippingService: selectedFreight.name,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Erro ao criar pedido.");
      }

      const order = await res.json();
      router.push(`/checkout/confirmacao?orderId=${order.id}`);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Erro ao criar pedido.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Render ─────────────────────────────────── */
  return (
    <div className="h-screen overflow-y-auto bg-neutral-light px-4 py-12">
      <div className="max-w-[960px] mx-auto">

        {/* Page title */}
        <div className="mb-8">
          <Link href="/" className="text-blue/40 text-xs font-semibold hover:text-red transition-colors">← Voltar à loja</Link>
          <h1 className="font-[var(--font-display)] text-blue text-2xl font-extrabold uppercase tracking-wide mt-2">
            Finalizar Compra
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Cart items */}
            <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-border">
                <h2 className="font-[var(--font-display)] text-blue font-extrabold uppercase tracking-wide text-sm">
                  Itens do pedido
                </h2>
              </div>
              <div className="divide-y divide-neutral-border">
                {DEMO_CART.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue/[0.05] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-blue text-sm truncate">{item.name}</p>
                      <p className="text-blue/40 text-xs font-mono">SKU {item.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-blue text-sm">{formatBRL(item.price)}</p>
                      <p className="text-blue/40 text-xs">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping form */}
            <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-border">
                <h2 className="font-[var(--font-display)] text-blue font-extrabold uppercase tracking-wide text-sm">
                  Endereço de entrega
                </h2>
              </div>
              <div className="p-6 space-y-4">

                {/* CEP row */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider mb-1">CEP *</label>
                    <input
                      type="text"
                      placeholder="00000000"
                      value={cep}
                      onChange={(e) => setCep(maskCEP(e.target.value))}
                      maxLength={8}
                      className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue font-mono placeholder:text-blue/20 focus:outline-none focus:border-blue/40"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCalculateFreight}
                      disabled={loadingFreight || cep.length !== 8}
                      className="px-5 py-2.5 bg-blue text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loadingFreight ? "Calculando..." : "Calcular frete"}
                    </button>
                  </div>
                </div>

                {/* Address fields */}
                <div className="grid grid-cols-[1fr_100px] gap-3">
                  <div>
                    <label className="block text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider mb-1">Rua</label>
                    <input type="text" placeholder="Nome da rua" value={address.rua} onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                      className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue placeholder:text-blue/20 focus:outline-none focus:border-blue/40" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider mb-1">Número</label>
                    <input type="text" placeholder="Nº" value={address.numero} onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                      className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue placeholder:text-blue/20 focus:outline-none focus:border-blue/40" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider mb-1">Bairro</label>
                    <input type="text" placeholder="Bairro" value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                      className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue placeholder:text-blue/20 focus:outline-none focus:border-blue/40" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider mb-1">Cidade</label>
                    <input type="text" placeholder="Cidade" value={address.cidade} onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                      className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue placeholder:text-blue/20 focus:outline-none focus:border-blue/40" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider mb-1">Estado</label>
                    <input type="text" placeholder="UF" maxLength={2} value={address.estado} onChange={(e) => setAddress({ ...address, estado: e.target.value.toUpperCase() })}
                      className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue placeholder:text-blue/20 focus:outline-none focus:border-blue/40" />
                  </div>
                </div>

                {/* Freight error */}
                {freightError && (
                  <p className="text-red text-xs font-semibold bg-red/5 px-4 py-2.5 rounded-xl">{freightError}</p>
                )}

                {/* Freight options */}
                {freightOptions.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[0.65rem] font-bold text-blue/50 uppercase tracking-wider">Opções de frete</p>
                    {freightOptions.map((opt) => {
                      const price = parseFloat(opt.custom_price ?? opt.price ?? "0");
                      const unavailable = !!opt.error || opt.price === null;
                      const isSelected = selectedFreight?.id === opt.id;

                      return (
                        <button
                          key={opt.id}
                          disabled={unavailable}
                          onClick={() => !unavailable && setSelectedFreight(opt)}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all ${
                            unavailable
                              ? "border-neutral-border bg-neutral-light opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "border-blue bg-blue/5 shadow-sm"
                              : "border-neutral-border bg-white hover:border-blue/40 hover:bg-blue/[0.02]"
                          }`}
                        >
                          {/* Radio dot */}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-blue" : "border-blue/20"}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-blue text-sm">{opt.name}</p>
                            <p className="text-blue/40 text-xs">{opt.company} · {unavailable ? (opt.error ?? "Indisponível") : `${opt.delivery_time} dias úteis`}</p>
                          </div>
                          {!unavailable && (
                            <span className="font-extrabold text-blue text-sm shrink-0">{formatBRL(price)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Order summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-border p-6 sticky top-6">
              <h2 className="font-[var(--font-display)] text-blue font-extrabold uppercase tracking-wide text-sm mb-5">
                Resumo do pedido
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-blue/60">
                  <span>Subtotal ({DEMO_CART.reduce((s, i) => s + i.quantity, 0)} itens)</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-blue/60">
                  <span>Frete</span>
                  <span>{selectedFreight ? formatBRL(shippingFee) : <span className="text-blue/30 text-xs">—</span>}</span>
                </div>
                <div className="flex justify-between text-blue/60">
                  <span>Desconto</span>
                  <span className="text-green-600">—</span>
                </div>
                <div className="h-px bg-neutral-border" />
                <div className="flex justify-between font-extrabold text-blue text-base">
                  <span>Total</span>
                  <span>{formatBRL(total)}</span>
                </div>
              </div>

              {selectedFreight && (
                <div className="mt-4 bg-blue/[0.04] rounded-xl px-4 py-3">
                  <p className="text-[0.6rem] font-bold text-blue/40 uppercase tracking-wider mb-0.5">Entrega via</p>
                  <p className="text-blue text-xs font-bold">{selectedFreight.company} — {selectedFreight.name}</p>
                  <p className="text-blue/50 text-xs">{selectedFreight.delivery_time} dias úteis</p>
                </div>
              )}

              {submitError && (
                <p className="mt-3 text-red text-xs font-semibold bg-red/5 px-4 py-2.5 rounded-xl">{submitError}</p>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={submitting || !selectedFreight}
                className="mt-5 w-full bg-blue text-white font-extrabold uppercase tracking-[0.08em] text-sm py-3.5 rounded-xl hover:bg-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Processando..." : "Finalizar Pedido"}
              </button>

              <p className="text-center text-blue/30 text-[0.6rem] mt-3">
                Ao finalizar você concorda com os termos de compra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
