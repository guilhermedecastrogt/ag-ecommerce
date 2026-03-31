"use client";

import {
  IconTruck,
  IconBus,
  IconTractor,
  IconExcavator,
  IconPickup,
  IconBoat,
  IconEngine,
  IconChip,
} from "./Icons";

const SERVICES = [
  { icon: IconTruck, label: "Caminhões", desc: "Diagnóstico e manutenção de sistemas diesel para todas as marcas de caminhões." },
  { icon: IconBus, label: "Ônibus e Micro-ônibus", desc: "Soluções completas para frotas de transporte coletivo e fretamento." },
  { icon: IconTractor, label: "Máquinas Agrícolas", desc: "Reparo e aferição de sistemas de injeção para tratores e colheitadeiras." },
  { icon: IconExcavator, label: "Máquinas Pesadas", desc: "Especialistas em sistemas HEUI e EUI para escavadeiras, pás-carregadeiras e mais." },
  { icon: IconPickup, label: "Picapes e Vans", desc: "Manutenção preventiva e corretiva para veículos utilitários diesel." },
  { icon: IconBoat, label: "Náuticos", desc: "Diagnóstico e reparo de motores diesel marítimos e fluviais." },
  { icon: IconEngine, label: "Outros Motores", desc: "Motores estacionários, geradores e aplicações industriais diversas." },
  { icon: IconChip, label: "Módulos Eletrônicos", desc: "Reparo e reprogramação de módulos eletrônicos de injeção diesel." },
];

export default function Services() {
  return (
    <div className="relative min-h-auto md:h-[100dvh] flex items-center bg-neutral-light overflow-hidden">
      {/* Parallax BG layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-light via-white to-neutral-light" />
      <div className="geo-shape text-blue -top-32 -right-32 !w-[400px] !h-[400px]" />
      <div className="hidden md:block absolute bottom-0 left-0 w-[35%] h-[50%] bg-blue/[0.02]" style={{ clipPath: "polygon(0 100%, 0 30%, 100% 100%)" }} />

      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-[30%] h-[4px] bg-gradient-to-r from-transparent via-red to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-14 section-content">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Nossos Serviços
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-2xl md:text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-2 md:mb-3">
            Serviços Diesel para cada{" "}
            <span className="text-red">aplicação</span>
          </h2>
          <p className="text-neutral-dark/60 text-xs md:text-base lg:text-lg max-w-2xl mx-auto">
            Atendemos linhas leve e pesada com diagnóstico e manutenção especializada.
          </p>
        </div>

        {/* Grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 section-content" style={{ transitionDelay: "200ms" }}>
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="sc-item group bg-white border border-neutral-border rounded-xl md:rounded-2xl p-3 md:p-5 card-hover cursor-pointer"
            >
              <div className="w-9 md:w-12 h-9 md:h-12 rounded-lg md:rounded-xl bg-blue/5 flex items-center justify-center text-blue group-hover:bg-red group-hover:text-white transition-all duration-180 mb-2 md:mb-4">
                <s.icon className="w-4 md:w-6 h-4 md:h-6" />
              </div>
              <h3 className="font-[var(--font-display)] text-blue text-xs md:text-base font-bold tracking-wide uppercase mb-1 md:mb-1.5">
                {s.label}
              </h3>
              <p className="hidden md:block text-neutral-dark/55 text-xs leading-relaxed mb-3">
                {s.desc}
              </p>
              <span className="hidden md:inline-flex items-center gap-1 text-red text-[0.65rem] font-bold tracking-wider uppercase group-hover:gap-2 transition-all duration-150">
                Agendar diagnóstico
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
