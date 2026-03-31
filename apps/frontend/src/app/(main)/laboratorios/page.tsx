import type { Metadata } from "next";
import Link from "next/link";
import Laboratories from "@/components/Laboratories";

export const metadata: Metadata = {
  title: "Laboratórios — Águia Diesel",
  description: "Laboratório de última geração para diagnóstico e testes de sistemas diesel.",
};

export default function LaboratoriosPage() {
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
            <span className="text-white/55">Laboratórios</span>
          </nav>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/70 mb-3">
            Infraestrutura de Precisão
          </p>
          <div className="w-10 h-0.5 bg-red mb-4" />
          <h1 className="font-[var(--font-display)] text-white text-3xl md:text-5xl font-extrabold uppercase tracking-wide leading-none">
            Nossos Laboratórios
          </h1>
          <p className="text-white/40 text-sm mt-3 max-w-lg leading-relaxed">
            Equipamentos de última geração para testes, calibração e diagnóstico avançado em sistemas diesel.
          </p>
        </div>
      </div>

      <Laboratories />
    </div>
  );
}
