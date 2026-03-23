"use client";

import { IconFlask, IconMicroscope, IconZap } from "./Icons";

const LABS = [
  {
    icon: IconMicroscope,
    title: "Clean Room para Injetores Common Rail",
    items: [
      "Bancada Bosch EPS 708",
      "Compatível com bombas CP1, CP3 e CP4",
      "Sistemas Delphi, Denso e Siemens",
      "Limpeza por ultrassom de alta precisão",
    ],
  },
  {
    icon: IconFlask,
    title: "Diagnósticos Completos em Sistemas de Injeção",
    items: [
      "Testes de vazão e pressão em injetores",
      "Calibração e aferição em bancadas dedicadas",
      "Análise eletrônica de módulos e sensores",
      "Laudos técnicos detalhados",
    ],
  },
  {
    icon: IconZap,
    title: "Soluções para HEUI e EUI",
    items: [
      "Especialistas em máquinas pesadas",
      "Diagnóstico de injetores unitários eletrônicos",
      "Reparo e recondicionamento HEUI",
      "Agilidade e precisão em cada processo",
    ],
  },
];

export default function Laboratories() {
  return (
    <div className="relative h-[100dvh] flex items-center bg-white overflow-hidden">
      {/* BG effects */}
      <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-red/[0.03] origin-top-right -skew-x-6 pointer-events-none" />
      <div className="geo-shape text-red -bottom-48 -left-48 !w-[500px] !h-[500px]" />
      <div className="absolute bottom-0 right-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue/20 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-14 section-content">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Alta Tecnologia
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-3">
            Laboratórios e bancadas{" "}
            <span className="text-red">de teste</span>
          </h2>
          <p className="text-neutral-dark/60 text-base lg:text-lg max-w-2xl mx-auto">
            Infraestrutura com bancadas e equipamentos de última geração para
            diagnóstico, reparo, manutenção e aferição de sistemas diesel.
          </p>
        </div>

        {/* Lab cards */}
        <div className="grid md:grid-cols-3 gap-5 section-content" style={{ transitionDelay: "200ms" }}>
          {LABS.map((lab, i) => (
            <div
              key={i}
              className="sc-item group relative bg-gradient-to-b from-blue/[0.02] to-blue/[0.06] border border-neutral-border rounded-2xl p-7 card-hover overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-red scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              <div className="w-12 h-12 rounded-xl bg-blue flex items-center justify-center text-white mb-5">
                <lab.icon className="w-6 h-6" />
              </div>

              <h3 className="font-[var(--font-display)] text-blue text-lg font-bold tracking-wide uppercase leading-snug mb-3">
                {lab.title}
              </h3>

              <ul className="space-y-2 mb-5">
                {lab.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-neutral-dark/65 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 section-content" style={{ transitionDelay: "400ms" }}>
          <a href="#contato" className="btn btn-primary text-base">
            Falar com um especialista
          </a>
        </div>
      </div>
    </div>
  );
}
