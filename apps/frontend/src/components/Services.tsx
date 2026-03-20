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
    <section id="servicos" className="relative py-24 lg:py-32 bg-neutral-light overflow-hidden">
      {/* Decorative shape */}
      <div className="geo-shape text-blue -top-32 -right-32 !w-[400px] !h-[400px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Nossos Serviços
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-4">
            Serviços Diesel para cada{" "}
            <span className="text-red">aplicação</span>
          </h2>
          <p className="text-neutral-dark/60 text-lg max-w-2xl mx-auto">
            Atendemos linhas leve e pesada com diagnóstico e manutenção
            especializada.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="reveal group bg-white border border-neutral-border rounded-2xl p-6 card-hover cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-blue/5 flex items-center justify-center text-blue group-hover:bg-red group-hover:text-white transition-all duration-180 mb-5">
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="font-[var(--font-display)] text-blue text-lg font-bold tracking-wide uppercase mb-2">
                {s.label}
              </h3>
              <p className="text-neutral-dark/55 text-sm leading-relaxed mb-4">
                {s.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-red text-xs font-bold tracking-wider uppercase group-hover:gap-2 transition-all duration-150">
                Agendar diagnóstico
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
