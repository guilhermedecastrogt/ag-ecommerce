"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmacaoContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-[calc(100vh-63px)] bg-neutral-light flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[520px]">
        {/* Success card */}
        <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
          {/* Green top bar */}
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600" />

          <div className="p-8 text-center">
            {/* Animated check */}
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="font-[var(--font-display)] text-blue text-2xl font-extrabold uppercase tracking-wide mb-2">
              Pedido confirmado!
            </h1>
            <p className="text-blue/50 text-sm leading-relaxed mb-6">
              Recebemos seu pedido com sucesso. Nossa equipe irá processá-lo e entrar em contato para confirmar a entrega.
            </p>

            {orderId && (
              <div className="bg-neutral-light rounded-xl border border-neutral-border px-5 py-4 mb-6 text-left">
                <p className="text-[0.6rem] font-extrabold text-blue/35 uppercase tracking-[0.18em] mb-1">
                  Número do pedido
                </p>
                <p className="font-mono text-blue text-[0.8rem] font-bold break-all">{orderId}</p>
              </div>
            )}

            {/* Steps */}
            <div className="text-left space-y-3 mb-8">
              {[
                { step: "01", label: "Pedido recebido", desc: "Status atual: PENDENTE", color: "text-blue" },
                { step: "02", label: "Confirmação de pagamento", desc: "Aguardando processamento", color: "text-blue/40" },
                { step: "03", label: "Envio", desc: "Separamos e despachamos seu pedido", color: "text-blue/40" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <span className="font-[var(--font-display)] text-[0.65rem] font-extrabold text-red/60 tracking-[0.1em] pt-0.5 shrink-0 w-6">
                    {s.step}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${s.color}`}>{s.label}</p>
                    <p className="text-blue/35 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/conta/pedidos"
                className="flex-1 flex items-center justify-center gap-2 bg-blue text-white font-extrabold uppercase tracking-[0.08em] text-sm py-3.5 rounded-xl hover:bg-red transition-colors"
              >
                Ver meus pedidos
              </Link>
              <Link
                href="/loja"
                className="flex-1 flex items-center justify-center gap-2 border border-blue/20 text-blue font-bold uppercase tracking-[0.08em] text-sm py-3.5 rounded-xl hover:bg-blue hover:text-white transition-all"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-63px)] flex items-center justify-center font-bold text-blue">Aguarde...</div>}>
      <ConfirmacaoContent />
    </Suspense>
  );
}
