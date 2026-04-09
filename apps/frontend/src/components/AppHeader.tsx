"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { IconShoppingCart, IconMenu, IconX } from "./Icons";

const NAV = [
  { label: "Início", href: "/" },
  { label: "Loja", href: "/loja" },
  { label: "Serviços", href: "/servicos" },
  { label: "Laboratórios", href: "/laboratorios" },
  { label: "Agendamento", href: "/agendamento" },
  { label: "Contato", href: "/contato" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Red precision line at very top */}
      <div className="h-[3px] bg-gradient-to-r from-red via-red to-red-dark w-full" />

      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/98 backdrop-blur-lg shadow-[0_1px_0_0_#E6EAF0,0_4px_24px_0_rgba(0,57,102,0.06)]"
            : "bg-white border-b border-neutral-border"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo-aguia.png"
              alt="Águia Diesel"
              width={96}
              height={34}
              style={{ height: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-[0.775rem] font-bold tracking-[0.06em] uppercase px-3 py-2 transition-colors duration-150 group ${
                    active ? "text-red" : "text-blue/50 hover:text-blue"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] bg-red rounded-full transition-transform duration-200 origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link
              href="/carrinho"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-blue/60 hover:text-blue hover:bg-neutral-light transition-all"
              aria-label="Carrinho"
            >
              <IconShoppingCart className="w-[18px] h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] bg-red text-white text-[0.55rem] font-bold rounded-full flex items-center justify-center px-[3px] leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative hidden xl:block ml-1">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-neutral-light transition-colors"
                >
                  <div className="w-[28px] h-[28px] rounded-md bg-blue flex items-center justify-center shrink-0">
                    <span className="text-white text-[0.65rem] font-extrabold uppercase">
                      {user?.name?.[0] ?? "U"}
                    </span>
                  </div>
                  <span className="text-[0.775rem] font-bold text-blue/80 tracking-tight">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <svg className="w-3 h-3 text-blue/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-neutral-border rounded-xl shadow-2xl shadow-blue/10 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-neutral-border bg-neutral-light">
                        <p className="text-[0.65rem] font-bold text-blue/40 uppercase tracking-widest">Conta</p>
                        <p className="text-sm font-semibold text-blue truncate">{user?.name}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/conta" className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue/70 hover:text-blue hover:bg-neutral-light transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          Minha Conta
                        </Link>
                        <Link href="/conta/pedidos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue/70 hover:text-blue hover:bg-neutral-light transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                          Meus Pedidos
                        </Link>
                      </div>
                      <div className="border-t border-neutral-border">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red/70 hover:text-red hover:bg-red/5 transition-colors">
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                          Sair da conta
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-2 ml-1">
                <Link href="/auth/login" className="text-[0.775rem] font-bold text-blue/60 hover:text-blue px-3 py-2 transition-colors">
                  Entrar
                </Link>
                <Link
                  href="/auth/cadastro"
                  className="text-[0.775rem] font-extrabold uppercase tracking-[0.08em] bg-red text-white px-4 py-2 rounded-lg hover:bg-red-dark transition-colors"
                >
                  Criar conta
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg text-blue hover:bg-neutral-light transition-colors ml-1"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`xl:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[600px]" : "max-h-0"}`}>
          <div className="border-t border-neutral-border bg-white px-4 pb-4 pt-2">
            <div className="space-y-0.5">
              {NAV.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors ${
                      active ? "text-red bg-red/5" : "text-blue/60 hover:text-blue hover:bg-neutral-light"
                    }`}
                  >
                    {active && <span className="w-1 h-4 bg-red rounded-full shrink-0" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/conta" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 text-sm font-semibold text-blue/70 rounded-lg hover:bg-neutral-light">Minha Conta</Link>
                  <Link href="/conta/pedidos" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 text-sm font-semibold text-blue/70 rounded-lg hover:bg-neutral-light">Meus Pedidos</Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="py-2.5 px-3 text-sm font-semibold text-red text-left rounded-lg hover:bg-red/5">Sair</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="py-3 px-4 text-center text-sm font-bold text-blue border border-blue/20 rounded-lg">Entrar</Link>
                  <Link href="/auth/cadastro" onClick={() => setMobileOpen(false)} className="py-3 px-4 text-center text-sm font-extrabold uppercase tracking-wider text-white bg-red rounded-lg">Criar conta</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
