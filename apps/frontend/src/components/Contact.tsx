"use client";

import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconWhatsApp,
  IconHeadphones,
} from "./Icons";

const CONTACTS = [
  {
    icon: IconPhone,
    label: "Central",
    value: "(62) 4008-6363",
    href: "tel:+556240086363",
  },
  {
    icon: IconMail,
    label: "E-mail",
    value: "contato@aguiadiesel.com.br",
    href: "mailto:contato@aguiadiesel.com.br",
  },
  {
    icon: IconPhone,
    label: "Vendas Online",
    value: "(62) 99905-6263",
    href: "tel:+5562999056263",
  },
  {
    icon: IconMapPin,
    label: "Endereço",
    value: "Av. Castelo Branco, 5728 — São Francisco, Goiânia/GO — 74.455-050",
    href: "https://maps.google.com/?q=Av.+Castelo+Branco+5728+Goiania+GO",
  },
];

export default function Contact() {
  return (
    <section id="contato" className="relative py-24 lg:py-32 bg-neutral-light overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-full bg-blue/[0.03] -skew-x-6 origin-top-right pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Contato
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-4">
            Fale com a{" "}
            <span className="text-red">Águia Diesel</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact cards */}
          <div className="lg:col-span-1 space-y-4 reveal-stagger">
            {CONTACTS.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="reveal flex items-start gap-4 bg-white border border-neutral-border rounded-xl p-5 card-hover group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue/5 flex items-center justify-center text-blue group-hover:bg-red group-hover:text-white transition-all shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-dark/40 text-xs font-bold tracking-wider uppercase block mb-0.5">
                    {c.label}
                  </span>
                  <span className="text-blue font-semibold text-sm leading-snug">
                    {c.value}
                  </span>
                </div>
              </a>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5562999056263"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold rounded-xl p-4 card-hover"
            >
              <IconWhatsApp className="w-5 h-5" />
              Chamar no WhatsApp
            </a>

            {/* Ouvidoria */}
            <div className="reveal bg-white border border-neutral-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <IconHeadphones className="w-5 h-5 text-blue" />
                <span className="font-[var(--font-display)] text-blue text-sm font-bold tracking-wider uppercase">
                  Ouvidoria
                </span>
              </div>
              <p className="text-neutral-dark/55 text-sm leading-relaxed">
                Dúvidas, reclamações ou sugestões? Entre em contato pela nossa
                central ou envie um e-mail. Sua opinião é importante.
              </p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="lg:col-span-2 reveal">
            <div className="bg-white border border-neutral-border rounded-2xl overflow-hidden h-full min-h-[400px] flex items-center justify-center">
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
    </section>
  );
}
