"use client";

import Image from "next/image";

const BRANDS = [
  { name: "Bosch", logo: "/brands/bosch.svg" },
  { name: "Delphi", logo: "/brands/delphi.svg" },
  { name: "Denso", logo: "/brands/denso.svg" },
  { name: "Siemens", logo: "/brands/siemens.svg" },
  { name: "Continental", logo: "/brands/continental.svg" },
  { name: "Cummins", logo: "/brands/cummins.svg" },
  { name: "MWM", logo: "/brands/mwm.svg" },
  { name: "Perkins", logo: "/brands/perkins.svg" },
];

export default function Brands() {
  return (
    <section className="relative py-20 lg:py-24 bg-neutral-light overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Parceiros
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.03em]">
            Concessionário das marcas
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 reveal-stagger">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="reveal group bg-white border border-neutral-border rounded-xl p-5 flex items-center justify-center h-24 card-hover"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={40}
                className="object-contain max-h-[32px] opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
