"use client";

import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconWhatsApp,
  IconHeadphones,
} from "./Icons";

const CONTACTS = [
  { icon: IconPhone, label: "Central", value: "(62) 4008-6363", href: "tel:+556240086363" },
  { icon: IconMail, label: "E-mail", value: "contato@aguiadiesel.com.br", href: "mailto:contato@aguiadiesel.com.br" },
  { icon: IconPhone, label: "Vendas Online", value: "(62) 99905-6263", href: "tel:+5562999056263" },
  { icon: IconMapPin, label: "Endereço", value: "Av. Castelo Branco, 5728 — São Francisco, Goiânia/GO", href: "https://maps.google.com/?q=Av.+Castelo+Branco+5728+Goiania+GO" },
];

export default function Contact() {
  return (
    <div className="relative min-h-auto md:h-[100dvh] flex items-center bg-neutral-light overflow-hidden">
      <div className="hidden md:block absolute top-0 right-0 w-[40%] h-full bg-blue/[0.03] -skew-x-6 origin-top-right pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0">
        <div className="text-center mb-8 md:mb-10 section-content">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Contato
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-2xl md:text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-2 md:mb-3">
            Fale com a{" "}
            <span className="text-red">Águia Diesel</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 section-content" style={{ transitionDelay: "150ms" }}>
          {/* Contact cards */}
          <div className="lg:col-span-1 space-y-2 md:space-y-3">
            {CONTACTS.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`sc-item flex items-start gap-3 bg-white border border-neutral-border rounded-xl p-3 md:p-4 card-hover group ${c.label === "Endereço" ? "hidden md:flex" : ""}`}
              >
                <div className="w-8 md:w-9 h-8 md:h-9 rounded-lg bg-blue/5 flex items-center justify-center text-blue group-hover:bg-red group-hover:text-white transition-all shrink-0">
                  <c.icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-neutral-dark/40 text-[0.6rem] font-bold tracking-wider uppercase block mb-0.5">
                    {c.label}
                  </span>
                  <span className="text-blue font-semibold text-xs md:text-sm leading-snug break-words">
                    {c.value}
                  </span>
                </div>
              </a>
            ))}

            <a
              href="https://wa.me/5562999056263"
              target="_blank"
              rel="noopener noreferrer"
              className="sc-item flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold rounded-xl p-3 md:p-3.5 text-sm card-hover"
            >
              <IconWhatsApp className="w-5 h-5" />
              Chamar no WhatsApp
            </a>

            {/* Ouvidoria — hidden on mobile */}
            <div className="hidden md:block sc-item bg-white border border-neutral-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <IconHeadphones className="w-4 h-4 text-blue" />
                <span className="font-[var(--font-display)] text-blue text-xs font-bold tracking-wider uppercase">
                  Ouvidoria
                </span>
              </div>
              <p className="text-neutral-dark/55 text-xs leading-relaxed">
                Dúvidas, reclamações ou sugestões? Entre em contato pela nossa central ou envie um e-mail.
              </p>
            </div>
          </div>

          {/* Map placeholder — hidden on mobile, replaced with simple link */}
          <div className="lg:col-span-2 sc-right">
            {/* Mobile: compact address + link */}
            <a
              href="https://maps.google.com/?q=Av.+Castelo+Branco+5728+Goiania+GO"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center gap-3 bg-white border border-neutral-border rounded-xl p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-blue/5 flex items-center justify-center text-blue shrink-0">
                <IconMapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-neutral-dark/40 text-[0.6rem] font-bold tracking-wider uppercase block mb-0.5">Endereço</span>
                <span className="text-blue font-semibold text-xs leading-snug">Av. Castelo Branco, 5728 — Goiânia/GO</span>
                <span className="text-red text-[0.6rem] font-bold tracking-wider uppercase block mt-1">Abrir no Maps →</span>
              </div>
            </a>

            {/* Desktop: map placeholder */}
            <div className="hidden md:flex bg-white border border-neutral-border rounded-2xl overflow-hidden h-full min-h-[320px] items-center justify-center">
              <div className="text-center p-8">
                <IconMapPin className="w-12 h-12 text-blue/20 mx-auto mb-4" />
                <p className="font-[var(--font-display)] text-blue/30 text-lg font-bold tracking-wider uppercase mb-2">
                  Mapa interativo
                </p>
                <p className="text-neutral-dark/40 text-sm">
                  Av. Castelo Branco, 5728 — São Francisco, Goiânia/GO
                </p>
                <a
                  href="https://maps.google.com/?q=Av.+Castelo+Branco+5728+Goiania+GO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-red text-sm font-bold tracking-wider uppercase hover:underline"
                >
                  Abrir no Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
