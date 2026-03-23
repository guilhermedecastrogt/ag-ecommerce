"use client";

import { useState, useRef, useEffect } from "react";
import { IconShoppingCart, IconSearch, IconPhone } from "./Icons";

/* ── Mock products ─────────────────────────────── */
const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "injetores", label: "Injetores" },
  { id: "bombas", label: "Bombas" },
  { id: "modulos", label: "Módulos" },
  { id: "sensores", label: "Sensores" },
  { id: "kits", label: "Kits de Reparo" },
];

const PRODUCTS = [
  { id: 1, name: "Injetor Common Rail Bosch CRI2-16", cat: "injetores", brand: "Bosch", price: 1849.90, oldPrice: 2199.90, tag: "Mais vendido", compat: "VW Constellation / MAN TGX", sku: "0445120215" },
  { id: 2, name: "Bomba de Alta Pressão CP3 Bosch", cat: "bombas", brand: "Bosch", price: 4290.00, oldPrice: null, tag: null, compat: "Mercedes-Benz Actros / Atego", sku: "0445020175" },
  { id: 3, name: "Módulo Eletrônico EDC7 Reparado", cat: "modulos", brand: "Bosch", price: 3750.00, oldPrice: 4500.00, tag: "Reparado", compat: "Iveco Stralis / Tector", sku: "0281020096" },
  { id: 4, name: "Injetor Denso Common Rail G3", cat: "injetores", brand: "Denso", price: 2150.00, oldPrice: null, tag: null, compat: "Toyota Hilux 3.0 D-4D", sku: "23670-30400" },
  { id: 5, name: "Sensor de Pressão Rail Delphi", cat: "sensores", brand: "Delphi", price: 489.90, oldPrice: 599.90, tag: "Promoção", compat: "Ford Ranger 2.8 / 3.0", sku: "9307Z521A" },
  { id: 6, name: "Kit Reparo Injetor CRIN Bosch", cat: "kits", brand: "Bosch", price: 289.90, oldPrice: null, tag: null, compat: "Aplicação universal CR", sku: "F00RJ02130" },
  { id: 7, name: "Bomba CP4 Bosch Remanufaturada", cat: "bombas", brand: "Bosch", price: 5890.00, oldPrice: 7200.00, tag: "Reman", compat: "Volkswagen Amarok 2.0 TDI", sku: "0445010546" },
  { id: 8, name: "Módulo ECU Siemens SID 208", cat: "modulos", brand: "Siemens", price: 4100.00, oldPrice: null, tag: null, compat: "Renault Master / Volvo FH", sku: "5WS40615" },
];

const BRANDS = ["Volkswagen", "Mercedes-Benz", "Iveco", "Volvo", "Ford", "Toyota", "New Holland", "Agrale"];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ── Product Card ──────────────────────────────── */
function ProductCard({ p, idx }: { p: typeof PRODUCTS[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="sc-item group relative bg-white rounded-2xl border border-neutral-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue/[0.07] hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {p.tag && (
        <div className="absolute top-3 left-3 z-10 bg-red text-white text-[0.6rem] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-lg">
          {p.tag}
        </div>
      )}

      <div className="relative h-36 bg-gradient-to-br from-neutral-light to-[#e8ecf1] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}>
            <div className="w-20 h-20 rounded-xl bg-blue/[0.07] flex items-center justify-center rotate-12">
              <div className="w-14 h-14 rounded-lg bg-blue/[0.08] flex items-center justify-center -rotate-12">
                <svg className="w-7 h-7 text-blue/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[0.55rem] font-bold text-blue/60 tracking-[0.12em] uppercase px-2 py-0.5 rounded-md">
          {p.brand}
        </div>
        <div className={`absolute inset-0 bg-blue/[0.03] transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`} />
      </div>

      <div className="p-4">
        <span className="text-[0.55rem] text-neutral-dark/30 font-mono tracking-wider block mb-1">SKU {p.sku}</span>
        <h3 className="font-[var(--font-display)] text-blue text-xs font-bold tracking-wide uppercase leading-snug mb-1 group-hover:text-red transition-colors duration-200 line-clamp-2 min-h-[2rem]">
          {p.name}
        </h3>
        <p className="text-neutral-dark/40 text-[0.6rem] leading-tight mb-3">{p.compat}</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="font-[var(--font-display)] text-blue font-extrabold text-lg tracking-wide leading-none">
            {formatBRL(p.price)}
          </span>
          {p.oldPrice && (
            <span className="text-neutral-dark/30 text-[0.65rem] line-through leading-none">
              {formatBRL(p.oldPrice)}
            </span>
          )}
        </div>
        {p.oldPrice && (
          <div className="inline-block bg-red/10 text-red text-[0.55rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded mb-3">
            -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF
          </div>
        )}
        <a
          href="https://loja.aguiadiesel.com.br/loja/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-blue text-white text-[0.65rem] font-bold tracking-wider uppercase py-2.5 rounded-xl hover:bg-red transition-colors duration-200"
        >
          <IconShoppingCart className="w-3 h-3" />
          Ver na loja
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  );
}

/* ── Ecommerce Section ─────────────────────────── */
export default function Ecommerce() {
  const [active, setActive] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filtered = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [active]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative h-[100dvh] flex items-center bg-white overflow-hidden">
      {/* BG accents */}
      <div className="absolute top-0 right-0 w-[45%] h-full bg-blue/[0.02] -skew-x-6 origin-top-right pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[60%] bg-red/[0.015] skew-x-3 origin-bottom-left pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 w-full">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 section-content">
          <div>
            <div className="inline-flex items-center gap-2 bg-red/5 rounded-full px-4 py-1.5 mb-3">
              <IconShoppingCart className="w-4 h-4 text-red" />
              <span className="text-red text-[0.65rem] font-bold tracking-[0.2em] uppercase">Loja Online</span>
            </div>
            <h2 className="font-[var(--font-display)] text-blue text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-[0.02em] leading-[0.95] mb-2">
              Peças e módulos diesel{" "}
              <span className="text-red">em destaque</span>
            </h2>
            <p className="text-neutral-dark/50 text-sm lg:text-base max-w-lg">
              Compre com a confiança de mais de 50 anos. Entrega para todo o Brasil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a href="tel:+556240086363" className="flex items-center gap-2 bg-blue/5 rounded-xl px-3 py-2 text-blue text-xs font-semibold hover:bg-blue/10 transition-colors">
              <IconPhone className="w-3.5 h-3.5" />
              (62) 4008-6363
            </a>
            <a href="https://loja.aguiadiesel.com.br/loja/" target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-2 !px-4 !text-xs">
              <IconShoppingCart className="w-3.5 h-3.5" />
              Ver toda a loja
            </a>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-5 section-content" style={{ transitionDelay: "100ms" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-3 py-1.5 rounded-lg text-[0.65rem] font-bold tracking-wider uppercase transition-all duration-200 ${
                active === c.id
                  ? "bg-blue text-white shadow-lg shadow-blue/20"
                  : "bg-neutral-light text-blue/50 hover:bg-blue/5 hover:text-blue"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product carousel */}
        <div className="relative section-content" style={{ transitionDelay: "200ms" }}>
          {canScrollLeft && (
            <button onClick={() => scroll(-1)} className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-border shadow-lg items-center justify-center text-blue hover:bg-blue hover:text-white hover:border-blue transition-all duration-200">
              <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
          {canScrollRight && (
            <button onClick={() => scroll(1)} className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-border shadow-lg items-center justify-center text-blue hover:bg-blue hover:text-white hover:border-blue transition-all duration-200">
              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}

          {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />}
          {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-3 -mb-3 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filtered.map((p, i) => (
              <div key={p.id} className="w-[240px] shrink-0 snap-start">
                <ProductCard p={p} idx={i} />
              </div>
            ))}

            <a
              href="https://loja.aguiadiesel.com.br/loja/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[240px] shrink-0 snap-start flex flex-col items-center justify-center bg-gradient-to-br from-blue/[0.03] to-blue/[0.08] border-2 border-dashed border-blue/10 rounded-2xl p-6 hover:border-red/30 hover:from-red/[0.02] hover:to-red/[0.05] transition-all duration-300 group min-h-[320px]"
            >
              <div className="w-14 h-14 rounded-xl bg-blue/[0.06] flex items-center justify-center mb-4 group-hover:bg-red/10 transition-colors">
                <svg className="w-6 h-6 text-blue/30 group-hover:text-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span className="font-[var(--font-display)] text-blue/40 group-hover:text-red text-xs font-bold tracking-wider uppercase text-center transition-colors">
                Ver todos os<br />produtos na loja
              </span>
            </a>
          </div>
        </div>

        {/* Brands bar */}
        <div className="mt-8 section-content" style={{ transitionDelay: "300ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <IconSearch className="w-3.5 h-3.5 text-blue/30" />
            <span className="font-[var(--font-display)] text-blue/40 text-[0.65rem] font-bold tracking-[0.2em] uppercase">
              Busque por aplicação
            </span>
            <div className="flex-1 h-px bg-neutral-border" />
          </div>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <a
                key={b}
                href="https://loja.aguiadiesel.com.br/loja/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-light border border-neutral-border rounded-lg px-3 py-1.5 text-[0.65rem] font-semibold text-blue/50 hover:border-red hover:text-red hover:bg-red/5 transition-all duration-200"
              >
                {b}
              </a>
            ))}
          </div>
          <p className="text-neutral-dark/30 text-[0.65rem] mt-3">
            Loja:{" "}
            <a href="mailto:lojavirtual@aguiadiesel.com.br" className="hover:text-red transition-colors underline">lojavirtual@aguiadiesel.com.br</a>
          </p>
        </div>
      </div>
    </div>
  );
}
