"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { IconShoppingCart } from "@/components/Icons";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CarrinhoPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const isEmpty = items.length === 0;
  const total = totalPrice; // Frete is calculated at checkout
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  if (isEmpty) {
    return (
      <div className="min-h-[calc(100vh-63px)] bg-neutral-light flex flex-col items-center justify-center px-4 py-20">
        <div className="w-24 h-24 rounded-2xl bg-blue/5 border border-blue/8 flex items-center justify-center mb-6">
          <IconShoppingCart className="w-10 h-10 text-blue/15" />
        </div>
        <h1 className="font-[var(--font-display)] text-blue text-2xl font-extrabold uppercase tracking-wide mb-2">
          Carrinho vazio
        </h1>
        <p className="text-blue/45 text-sm mb-8 text-center max-w-xs">
          Você ainda não adicionou nenhum produto ao carrinho.
        </p>
        <Link
          href="/loja"
          className="flex items-center gap-2 bg-blue text-white font-extrabold uppercase tracking-[0.1em] text-sm px-6 py-3.5 rounded-xl hover:bg-red transition-colors"
        >
          <IconShoppingCart className="w-4 h-4" />
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-blue/35 mb-1.5">
              <Link href="/" className="hover:text-blue/60 transition-colors">Início</Link>
              <span className="text-blue/20">/</span>
              <span className="text-blue/55">Carrinho</span>
            </nav>
            <h1 className="font-[var(--font-display)] text-blue text-2xl font-extrabold uppercase tracking-wide flex items-center gap-3">
              Meu Carrinho
              <span className="text-sm font-bold text-blue/40 normal-case tracking-normal">
                ({totalQty} item{totalQty !== 1 ? "s" : ""})
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-red/50 hover:text-red transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>
            Limpar
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl border border-neutral-border p-4 flex gap-4 items-center group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image */}
                <Link href={`/loja/${item.slug}`} className="w-[72px] h-[72px] shrink-0 rounded-lg bg-neutral-light border border-neutral-border overflow-hidden flex items-center justify-center hover:border-blue/30 transition-colors">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-blue/12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" /></svg>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/loja/${item.slug}`} className="font-[var(--font-display)] text-blue text-[0.85rem] font-bold uppercase tracking-wide hover:text-red transition-colors line-clamp-1 block">
                    {item.name}
                  </Link>
                  <span className="text-blue/40 text-xs font-semibold">{formatBRL(item.price)} / un.</span>
                </div>

                {/* Qty control */}
                <div className="flex items-center border border-neutral-border rounded-lg overflow-hidden bg-neutral-light shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-blue hover:bg-red hover:text-white transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold text-blue select-none">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-blue hover:bg-blue hover:text-white transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-[var(--font-display)] text-blue font-extrabold text-[1.1rem] tracking-wide shrink-0 w-24 text-right hidden sm:block">
                  {formatBRL(item.price * item.quantity)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-blue/20 hover:text-red transition-colors p-1.5 rounded-lg hover:bg-red/5"
                  aria-label="Remover"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))}

            <Link href="/loja" className="inline-flex items-center gap-2 text-blue/40 text-xs font-bold uppercase tracking-[0.1em] hover:text-blue transition-colors pt-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Continuar comprando
            </Link>
          </div>

          {/* Summary — dark panel */}
          <div className="lg:col-span-1">
            <div className="bg-[#001429] rounded-2xl overflow-hidden sticky top-24">
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-[var(--font-display)] text-white text-sm font-extrabold uppercase tracking-[0.15em]">
                  Resumo do pedido
                </h2>
              </div>

              <div className="px-6 py-5 space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-white/40 truncate max-w-[160px]">
                      <span className="text-white/60 font-bold">{item.quantity}×</span> {item.name}
                    </span>
                    <span className="text-white/70 font-semibold shrink-0 ml-2">{formatBRL(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6 space-y-3 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between text-sm text-white/40">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white/60">{formatBRL(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/40">
                  <span>Frete estimado</span>
                  <span className="font-semibold text-white/60">A calcular no checkout</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                  <span className="font-[var(--font-display)] text-white font-extrabold uppercase tracking-wider text-sm">Total</span>
                  <span className="font-[var(--font-display)] text-white font-extrabold text-2xl tracking-wide">{formatBRL(total)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-2 flex items-center justify-center gap-2 w-full bg-red text-white font-extrabold uppercase tracking-[0.1em] text-sm py-4 rounded-xl hover:bg-red-dark transition-colors"
                >
                  Finalizar compra
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>

                <p className="flex items-center justify-center gap-1.5 text-white/25 text-[0.65rem] pt-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  Pedido seguro — criptografia SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
