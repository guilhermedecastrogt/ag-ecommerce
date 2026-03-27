"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IconMenu, IconX, IconShoppingCart } from "./Icons";

const NAV_ITEMS = [
  { label: "Início", idx: 0 },
  { label: "Serviços Diesel", idx: 2 },
  { label: "Laboratórios", idx: 3 },
  { label: "Agendamento", idx: 4 },
  { label: "Emergência 24h", idx: 5 },
  { label: "Produtos", idx: 1 },
  { label: "Quem Somos", idx: 7 },
  { label: "Contato", idx: 8 },
];

interface HeaderProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function Header({ activeIndex, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    /* Listen on the fp-container instead of window */
    const container = document.querySelector(".fp-container");
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 20);
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (idx: number) => {
    onNavigate(idx);
    setMobileOpen(false);
  };

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
          <button onClick={() => handleNav(0)} className="flex items-center shrink-0 py-1 cursor-pointer bg-transparent border-0">
            <Image
              src="/logo-aguia.png"
              alt="Águia Diesel"
              width={scrolled ? 100 : 110}
              height={scrolled ? 36 : 39}
              className="transition-all duration-300 md:w-auto"
              style={{ width: scrolled ? 100 : 110, height: "auto" }}
              priority
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.idx)}
                className={`relative text-[0.8125rem] font-semibold tracking-wide px-3 py-2 rounded-lg transition-all duration-150 group bg-transparent border-0 cursor-pointer ${
                  activeIndex === item.idx
                    ? scrolled ? "text-red" : "text-white"
                    : scrolled
                      ? "text-blue/70 hover:text-blue hover:bg-blue/5"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-red rounded-full transition-transform duration-200 origin-left ${
                  activeIndex === item.idx ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </button>
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
            <button onClick={() => handleNav(4)} className="btn btn-primary !py-2 !px-5 !text-xs">
              Agendar Serviço
            </button>
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
            <button
              key={item.label}
              onClick={() => handleNav(item.idx)}
              className={`block w-full text-left text-sm font-medium py-2.5 px-4 rounded-lg transition-colors bg-transparent border-0 cursor-pointer ${
                activeIndex === item.idx
                  ? "text-red bg-red/5"
                  : "text-blue/70 hover:text-blue hover:bg-blue/5"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-neutral-border mt-3">
            <button onClick={() => handleNav(4)} className="btn btn-primary !text-sm">
              Agendar Serviço
            </button>
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
