"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const FOOTER_LINKS = [
  { label: "Página Inicial", href: "#inicio" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Nosso Propósito", href: "#quem-somos" },
  { label: "Sustentabilidade", href: "#quem-somos" },
  { label: "Agendamento", href: "#agendamento" },
  { label: "Contato", href: "#contato" },
  { label: "Política de Privacidade", href: "#" },
];

export default function Footer() {
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("aguia-cookies-accepted");
    if (!dismissed) {
      const timer = setTimeout(() => setShowCookies(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("aguia-cookies-accepted", "true");
    setShowCookies(false);
  };

  return (
    <>
      <div className="relative min-h-auto md:h-[100dvh] flex items-end bg-blue overflow-hidden">
        <div className="w-full py-10 md:py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top: logo + links */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10 section-content">
              {/* Brand */}
              <div className="col-span-2 lg:col-span-1">
                <div className="mb-3 md:mb-4">
                  <Image
                    src="/logo-aguia.png"
                    alt="Águia Diesel"
                    width={120}
                    height={43}
                    className="md:w-[150px]"
                  />
                </div>
                <p className="text-white/45 text-xs md:text-sm leading-relaxed max-w-xs">
                  Diagnóstico e excelência em diesel, do laboratório à estrada.
                  Mais de 50 anos de experiência.
                </p>
              </div>

              {/* Links — 2 columns on mobile */}
              <div>
                <h4 className="font-[var(--font-display)] text-white/70 text-[0.6rem] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 md:mb-4">
                  Navegação
                </h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {FOOTER_LINKS.slice(0, 4).map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-white/50 text-xs md:text-sm hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-[var(--font-display)] text-white/70 text-[0.6rem] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 md:mb-4">
                  Atendimento
                </h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {FOOTER_LINKS.slice(4).map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-white/50 text-xs md:text-sm hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick contact — hidden on mobile (already shown in Contact section) */}
              <div className="hidden lg:block">
                <h4 className="font-[var(--font-display)] text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                  Contato rápido
                </h4>
                <ul className="space-y-2 text-sm text-white/50">
                  <li>
                    <a href="tel:+556240086363" className="hover:text-white transition-colors">
                      (62) 4008-6363
                    </a>
                  </li>
                  <li>
                    <a href="mailto:contato@aguiadiesel.com.br" className="hover:text-white transition-colors">
                      contato@aguiadiesel.com.br
                    </a>
                  </li>
                  <li>Goiânia / GO</li>
                </ul>
              </div>
            </div>

            {/* Divider + copyright */}
            <div className="border-t border-white/10 pt-4 md:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 section-content" style={{ transitionDelay: "200ms" }}>
              <p className="text-white/30 text-[0.6rem] md:text-xs tracking-wider text-center sm:text-left">
                &copy; Águia Diesel — 2026. Todos os direitos reservados.
              </p>
              <div className="hidden md:flex gap-3">
                <span className="text-white/20 text-xs tracking-wider">
                  Infraestrutura de laboratório para testes e aferição
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Banner */}
      <div
        className={`cookie-banner fixed bottom-0 left-0 right-0 z-[60] ${
          showCookies ? "show" : ""
        }`}
      >
        <div className="bg-neutral-dark border-t border-white/10 px-4 sm:px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm text-center sm:text-left">
              Utilizamos cookies para melhorar sua experiência. Você pode gerenciar nas configurações.
            </p>
            <div className="flex gap-3 shrink-0">
              <button onClick={acceptCookies} className="btn btn-primary !py-2 !px-6 !text-xs">
                Aceitar
              </button>
              <button onClick={acceptCookies} className="btn btn-secondary !py-2 !px-6 !text-xs !border-white/30 !text-white/70">
                Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
