"use client";

import { useState } from "react";
import { IconChevronDown } from "./Icons";

const FAQS = [
  {
    question: "Quais tipos de veículos vocês atendem?",
    answer: "Atendemos caminhões, ônibus e micro-ônibus, máquinas agrícolas, máquinas pesadas, picapes e vans, embarcações náuticas, motores estacionários e módulos eletrônicos de injeção diesel.",
  },
  {
    question: "Como agendar um diagnóstico?",
    answer: "Você pode agendar pelo formulário na seção Agendamento desta página, pelo telefone (62) 4008-6363 ou diretamente pelo WhatsApp. Nossa equipe retorna o contato para confirmar data e horário.",
  },
  {
    question: "Vocês atendem emergências?",
    answer: "Sim! Oferecemos atendimento técnico emergencial 24 horas por dia, 7 dias por semana, inclusive em feriados. Basta ligar para nossa central ou acionar pelo WhatsApp.",
  },
  {
    question: "Vocês vendem peças para todo o Brasil?",
    answer: "Sim. Nossa loja online (loja.aguiadiesel.com.br) realiza entregas em todo o território nacional. Você encontra peças e módulos diesel com a mesma qualidade e confiança do nosso atendimento presencial.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="relative h-[100dvh] flex items-center bg-white overflow-hidden">
      {/* BG accents */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue/10 to-transparent" />
      <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 rounded-[2rem] bg-red rotate-45" />
        <div className="absolute inset-0 rounded-[2rem] bg-red -rotate-45" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10 section-content">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Dúvidas Frequentes
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em]">
            Perguntas e Respostas
          </h2>
        </div>

        <div className="space-y-3 section-content" style={{ transitionDelay: "200ms" }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="sc-item border border-neutral-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-neutral-light/50 transition-colors bg-transparent border-0 cursor-pointer"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-blue text-[0.9375rem]">
                  {faq.question}
                </span>
                <IconChevronDown
                  className={`w-5 h-5 text-red shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`faq-answer ${openIndex === i ? "open" : ""}`}>
                <div>
                  <div className="px-5 pb-5 text-neutral-dark/60 text-sm leading-relaxed border-t border-neutral-border pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
