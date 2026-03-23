"use client";

import { IconClock24, IconPhone } from "./Icons";

export default function Emergency() {
  return (
    <div className="relative h-[100dvh] flex items-center bg-red overflow-hidden">
      {/* Geometric accents */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 border-[6px] border-white/10 rounded-3xl rotate-45" />
      <div className="absolute -right-16 -bottom-16 w-48 h-48 border-[6px] border-white/10 rounded-3xl rotate-12" />
      <div className="absolute top-20 right-20 w-32 h-32 border-[4px] border-white/[0.06] rounded-2xl -rotate-20" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #fff 0px, transparent 1px, transparent 40px)`,
        }}
      />

      {/* Pulsing glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)", animation: "emergencyPulse 3s ease-in-out infinite" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="section-content">
          <div className="w-24 h-24 rounded-3xl bg-white/15 flex items-center justify-center mx-auto mb-8" style={{ animation: "emergencyIcon 2s ease-in-out infinite" }}>
            <IconClock24 className="w-12 h-12 text-white" />
          </div>

          <h2 className="font-[var(--font-display)] text-white text-4xl sm:text-5xl lg:text-7xl font-extrabold uppercase tracking-[0.04em] leading-tight mb-5">
            Emergência 24 horas
          </h2>

          <p className="text-white/80 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-12">
            Atendimento técnico emergencial 24h por dia, 7 dias por semana,
            inclusive em feriados. Sua operação não pode parar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+556240086363"
              className="btn !bg-white !text-red hover:!bg-white/90 text-lg !px-12 !py-5 !border-white !rounded-2xl"
            >
              <IconPhone className="w-6 h-6" />
              Acionar Emergência
            </a>
            <a
              href="https://wa.me/5562999056263"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-lg !px-10 !py-5 !rounded-2xl"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes emergencyPulse { 0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.15; } 50% { transform:translate(-50%,-50%) scale(1.2); opacity:0.25; } }
        @keyframes emergencyIcon { 0%,100% { transform:scale(1) rotate(0deg); } 50% { transform:scale(1.08) rotate(5deg); } }
      `}</style>
    </div>
  );
}
