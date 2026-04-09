"use client";

import { IconShield, IconAward, IconFlask, IconZap } from "./Icons";

const PILLARS = [
  {
    icon: IconShield,
    title: "+50 anos",
    desc: "Mais de cinco décadas de experiência em sistemas eletrônicos diesel, com transparência e excelência.",
  },
  {
    icon: IconAward,
    title: "ISO 9001",
    desc: "Certificação há mais de 10 anos, com auditorias regulares e gestão rigorosa da qualidade.",
  },
  {
    icon: IconFlask,
    title: "Inovação",
    desc: "Foco em melhoria contínua, inovação tecnológica e capacitação técnica permanente.",
  },
  {
    icon: IconZap,
    title: "Sustentabilidade",
    desc: "Compromisso com responsabilidade ambiental e sustentabilidade de processos.",
  },
];

export default function AboutUs() {
  return (
    <div className="relative min-h-auto md:h-[100dvh] flex items-center bg-white overflow-hidden">
      <div className="hidden md:block absolute top-0 left-0 w-2 h-full bg-red" />
      <div className="geo-shape text-blue -top-32 -right-32 !w-[350px] !h-[350px]" />
      <div className="hidden md:block absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue/[0.02]" style={{ clipPath: "polygon(100% 100%, 0 100%, 100% 30%)" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="sc-left text-center md:text-left">
            <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Quem Somos
            </span>
            <h2 className="font-[var(--font-display)] text-blue text-2xl md:text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-3 md:mb-5">
              Tradição, qualidade e{" "}
              <span className="text-red">evolução contínua</span>
            </h2>
            <p className="text-neutral-dark/65 text-sm md:text-base lg:text-lg leading-relaxed mb-3">
              Há mais de 50 anos, a Águia Diesel é referência em diagnóstico e
              manutenção de sistemas diesel. Nossa trajetória é marcada pela
              busca constante por excelência em produtos e serviços.
            </p>
            <p className="hidden md:block text-neutral-dark/65 text-sm lg:text-base leading-relaxed mb-6">
              Com certificação ISO 9001 há mais de uma década, investimos em
              capacitação técnica, infraestrutura de laboratório e processos
              sustentáveis para entregar o melhor resultado a cada cliente.
            </p>
            <a href="#contato" className="btn btn-primary mt-4 md:mt-0">
              Falar com a Águia Diesel
            </a>
          </div>

          {/* Right: pillars grid — 2x2 on mobile */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 sc-right">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="sc-item bg-neutral-light border border-neutral-border rounded-xl md:rounded-2xl p-3 md:p-5 card-hover"
              >
                <div className="w-9 md:w-11 h-9 md:h-11 rounded-lg md:rounded-xl bg-blue flex items-center justify-center text-white mb-2 md:mb-3">
                  <p.icon className="w-4 md:w-5 h-4 md:h-5" />
                </div>
                <h3 className="font-[var(--font-display)] text-blue text-xs md:text-base font-bold tracking-wide uppercase mb-1 md:mb-1.5">
                  {p.title}
                </h3>
                <p className="text-neutral-dark/55 text-[0.6rem] md:text-xs leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
