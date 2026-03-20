"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IconMenu, IconX, IconShoppingCart } from "./Icons";

const NAV_ITEMS = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços Diesel", href: "#servicos" },
  { label: "Laboratórios", href: "#laboratorios" },
  { label: "Agendamento", href: "#agendamento" },
  { label: "Emergência 24h", href: "#emergencia" },
  { label: "Produtos", href: "#loja" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl shadow-black/8 h-[64px]"
          : "bg-gradient-to-b from-black/40 via-black/20 to-transparent h-[88px]"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo — cores originais, com glow branco para contraste quando não scrollado */}
          <a href="#inicio" className="flex items-center shrink-0 py-1">
            <Image
              src="/logo-aguia.png"
              alt="Águia Diesel"
              width={scrolled ? 120 : 140}
              height={scrolled ? 43 : 50}
              className="transition-all duration-300"
              priority
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-[0.8125rem] font-semibold tracking-wide px-3 py-2 rounded-lg transition-all duration-150 group ${
                  scrolled
                    ? "text-blue/70 hover:text-blue hover:bg-blue/5"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden xl:flex items-center gap-3">
            <a
              href="https://loja.aguiadiesel.com.br/loja/"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn !py-2 !px-4 !text-xs ${
                scrolled
                  ? "btn-secondary-blue"
                  : "btn-secondary !border-white/40"
              }`}
            >
              <IconShoppingCart className="w-4 h-4" />
              Visitar Loja
            </a>
            <a href="#agendamento" className="btn btn-primary !py-2 !px-5 !text-xs">
              Agendar Serviço
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`xl:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? "text-blue hover:bg-blue/5"
                : "text-white hover:bg-white/10"
            }`}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/98 backdrop-blur-lg border-t border-neutral-border px-4 py-4 space-y-1 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-blue/70 hover:text-blue text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-blue/5 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-neutral-border mt-3">
            <a href="#agendamento" className="btn btn-primary !text-sm" onClick={() => setMobileOpen(false)}>
              Agendar Serviço
            </a>
            <a
              href="https://loja.aguiadiesel.com.br/loja/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary-blue !text-sm"
              onClick={() => setMobileOpen(false)}
            >
              <IconShoppingCart className="w-4 h-4" />
              Visitar Loja
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
