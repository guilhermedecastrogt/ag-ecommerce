"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const redirect = params.get("redirect") ?? "/";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message ?? "Credenciais inválidas.");
            }
            const data = await res.json();
            localStorage.setItem("accessToken", data.accessToken);
            if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
            router.push(redirect);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Credenciais inválidas.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px]">
            {/* Mobile logo */}
            <div className="flex justify-center mb-8 lg:hidden">
                <Link href="/">
                    <Image src="/logo-aguia.png" alt="Águia Diesel" width={100} height={36} style={{ height: "auto" }} />
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide mb-1">
                    Entrar
                </h1>
                <p className="text-blue/50 text-sm">
                    Novo por aqui?{" "}
                    <Link href="/auth/cadastro" className="text-red font-semibold hover:underline">
                        Criar conta grátis
                    </Link>
                </p>
            </div>

            {error && (
                <div className="mb-6 flex items-start gap-3 bg-red/5 border border-red/15 text-red text-sm px-4 py-3 rounded-xl">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-[0.7rem] font-extrabold text-blue/50 uppercase tracking-[0.12em] mb-2">
                        E-mail
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-white border border-neutral-border rounded-xl px-4 py-3.5 text-sm text-blue placeholder-blue/25 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/8 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[0.7rem] font-extrabold text-blue/50 uppercase tracking-[0.12em] mb-2">
                        Senha
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-neutral-border rounded-xl px-4 py-3.5 text-sm text-blue placeholder-blue/25 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/8 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue text-white font-extrabold uppercase tracking-[0.1em] text-sm py-4 rounded-xl hover:bg-red transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Entrando...
                        </>
                    ) : (
                        <>
                            Entrar na conta
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-border text-center">
                <Link href="/" className="text-xs text-blue/30 hover:text-blue/60 transition-colors">
                    ← Voltar ao site
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-63px)] flex">
            {/* Left panel — brand */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative bg-[#001429] flex-col justify-between p-12 overflow-hidden">
                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Diagonal accent */}
                <div
                    className="absolute top-0 right-0 w-[40%] h-full bg-red/[0.06]"
                    style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0% 100%)" }}
                />
                <div
                    className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(223,4,11,0.08) 0%, transparent 70%)" }}
                />

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/">
                        <Image src="/logo-aguia.png" alt="Águia Diesel" width={110} height={40} style={{ height: "auto" }} priority />
                    </Link>
                </div>

                <div className="relative z-10">
                    <div className="w-10 h-[2px] bg-red mb-6" />
                    <h2 className="font-[var(--font-display)] text-white text-4xl xl:text-5xl font-extrabold uppercase leading-[0.95] tracking-wide mb-4">
                        Acesse sua<br />
                        <span className="text-red">conta</span>
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                        Gerencie seus pedidos, acompanhe entregas e acesse o histórico de compras.
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                    {[
                        { label: "Pedidos em tempo real", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6" },
                        { label: "Histórico de compras", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
                        { label: "Cancelamento fácil", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-red/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={item.icon} />
                                </svg>
                            </span>
                            <span className="text-white/50 text-sm">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-neutral-light">
                <Suspense fallback={<div className="w-full max-w-[400px] animate-pulse h-64 bg-neutral-200 rounded-xl" />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}

