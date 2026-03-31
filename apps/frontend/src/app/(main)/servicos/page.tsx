import type { Metadata } from "next";
import Link from "next/link";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Serviços Diesel — Águia Diesel",
  description: "Diagnóstico, manutenção e testes em sistemas diesel com infraestrutura de laboratório.",
};

export default function ServicosPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#001429] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[35%] h-full bg-red/[0.06]"
          style={{ clipPath: "polygon(35% 0, 100% 0, 100% 100%, 8% 100%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-white/30 mb-5">
            <Link href="/" className="hover:text-white/55 transition-colors">Início</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/55">Serviços</span>
          </nav>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/70 mb-3">
            Manutenção &amp; Diagnóstico
          </p>
          <div className="w-10 h-0.5 bg-red mb-4" />
          <h1 className="font-[var(--font-display)] text-white text-3xl md:text-5xl font-extrabold uppercase tracking-wide leading-none">
            Serviços Diesel
          </h1>
          <p className="text-white/40 text-sm mt-3 max-w-lg leading-relaxed">
            Diagnóstico completo, manutenção e testes especializados em sistemas diesel com infraestrutura de ponta.
          </p>
        </div>
      </div>

      <Services />
    </div>
  );
}
