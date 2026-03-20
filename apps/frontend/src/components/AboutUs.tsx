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
    <section id="quem-somos" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-red" />
      <div className="geo-shape text-blue -top-32 -right-32 !w-[350px] !h-[350px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="reveal">
            <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Quem Somos
            </span>
            <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-6">
              Tradição, qualidade e{" "}
              <span className="text-red">evolução contínua</span>
            </h2>
            <p className="text-neutral-dark/65 text-lg leading-relaxed mb-4">
              Há mais de 50 anos, a Águia Diesel é referência em diagnóstico e
              manutenção de sistemas diesel. Nossa trajetória é marcada pela
              busca constante por excelência em produtos e serviços.
            </p>
            <p className="text-neutral-dark/65 text-base leading-relaxed mb-8">
              Com certificação ISO 9001 há mais de uma década, investimos em
              capacitação técnica, infraestrutura de laboratório e processos
              sustentáveis para entregar o melhor resultado a cada cliente.
            </p>
            <a href="#contato" className="btn btn-primary">
              Falar com a Águia Diesel
            </a>
          </div>

          {/* Right: pillars grid */}
          <div className="grid sm:grid-cols-2 gap-5 reveal-stagger">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="reveal bg-neutral-light border border-neutral-border rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-blue flex items-center justify-center text-white mb-4">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="font-[var(--font-display)] text-blue text-lg font-bold tracking-wide uppercase mb-2">
                  {p.title}
                </h3>
                <p className="text-neutral-dark/55 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
