"use client";

import { IconClock24, IconPhone } from "./Icons";

export default function Emergency() {
  return (
    <section id="emergencia" className="relative py-20 lg:py-28 bg-red overflow-hidden">
      {/* Geometric accents */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 border-[6px] border-white/10 rounded-3xl rotate-45" />
      <div className="absolute -right-16 -bottom-16 w-48 h-48 border-[6px] border-white/10 rounded-3xl rotate-12" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #fff 0px, transparent 1px, transparent 40px)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal">
          <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-8">
            <IconClock24 className="w-10 h-10 text-white" />
          </div>

          <h2 className="font-[var(--font-display)] text-white text-3xl sm:text-4xl lg:text-6xl font-extrabold uppercase tracking-[0.04em] leading-tight mb-4">
            Emergência 24 horas
          </h2>

          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Atendimento técnico emergencial 24h por dia, 7 dias por semana,
            inclusive em feriados. Sua operação não pode parar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+556240086363"
              className="btn !bg-white !text-red hover:!bg-white/90 text-base !px-10 !py-4 !border-white"
            >
              <IconPhone className="w-5 h-5" />
              Acionar Emergência
            </a>
            <a
              href="https://wa.me/5562999056263"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-base !px-8 !py-4"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
