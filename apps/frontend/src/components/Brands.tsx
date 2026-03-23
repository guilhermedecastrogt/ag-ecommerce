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
    <div className="relative h-[100dvh] flex items-center bg-neutral-light overflow-hidden">
      {/* BG accents */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red/30 to-transparent" />
      <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0 rounded-[3rem] bg-blue rotate-45" />
        <div className="absolute inset-0 rounded-[3rem] bg-blue -rotate-45" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-14 section-content">
          <span className="inline-block text-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Parceiros
          </span>
          <h2 className="font-[var(--font-display)] text-blue text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em]">
            Concessionário das marcas
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 section-content" style={{ transitionDelay: "200ms" }}>
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="sc-item group bg-white border border-neutral-border rounded-2xl p-6 flex items-center justify-center h-28 card-hover"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={40}
                className="object-contain max-h-[36px] opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
