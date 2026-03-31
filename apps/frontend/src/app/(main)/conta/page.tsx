"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ContaPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login?redirect=/conta");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => { await logout(); router.push("/"); };

  const initial = user?.name?.[0]?.toUpperCase() ?? "U";

  const quickLinks = [
    {
      href: "/conta/pedidos",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      label: "Meus Pedidos",
      desc: "Acompanhe e gerencie suas compras",
      accent: "blue",
    },
    {
      href: "/loja",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      ),
      label: "Loja",
      desc: "Catálogo de peças diesel",
      accent: "red",
    },
    {
      href: "/agendamento",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      ),
      label: "Agendamento",
      desc: "Serviços de diagnóstico e manutenção",
      accent: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero bar */}
      <div className="relative bg-[#001429] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-[30%] h-full bg-red/[0.05]" style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 10% 100%)" }} />

        <div className="relative max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-white/30 mb-5">
            <Link href="/" className="hover:text-white/50 transition-colors">Início</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/50">Minha Conta</span>
          </nav>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-xl bg-red flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-[var(--font-display)] font-extrabold">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] mb-0.5">Bem-vindo</p>
              <h1 className="font-[var(--font-display)] text-white text-2xl font-extrabold uppercase tracking-wide truncate">
                {user?.name}
              </h1>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-white/30 hover:text-red text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-xl border border-neutral-border p-6 flex flex-col gap-5 hover:shadow-xl hover:shadow-blue/6 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                item.accent === "red"
                  ? "bg-red/8 text-red group-hover:bg-red group-hover:text-white"
                  : "bg-blue/6 text-blue group-hover:bg-blue group-hover:text-white"
              }`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-[var(--font-display)] text-blue text-sm font-extrabold uppercase tracking-wide mb-1 group-hover:text-red transition-colors">
                  {item.label}
                </h3>
                <p className="text-blue/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-blue/25 group-hover:text-blue/50 transition-colors">
                Acessar
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile logout */}
        <button
          onClick={handleLogout}
          className="sm:hidden mt-4 w-full py-3 text-sm font-bold text-red/60 hover:text-red border border-red/10 hover:border-red/20 rounded-xl transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
