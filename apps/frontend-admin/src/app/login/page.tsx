"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#001429] flex items-center justify-center px-4">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-1 h-8 bg-red" />
            <span className="font-[var(--font-display)] text-white text-2xl font-extrabold uppercase tracking-[0.15em]">
              Águia Diesel
            </span>
          </div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
            Painel Administrativo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-4 flex items-center gap-2 text-red text-sm bg-red/10 border border-red/20 px-3 py-2.5 rounded-lg">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.65rem] font-extrabold text-white/35 uppercase tracking-[0.15em] mb-1.5">
                E-mail
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aguiadiesel.com.br"
                className="w-full bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red/50 focus:ring-2 focus:ring-red/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[0.65rem] font-extrabold text-white/35 uppercase tracking-[0.15em] mb-1.5">
                Senha
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red/50 focus:ring-2 focus:ring-red/10 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red text-white font-extrabold uppercase tracking-[0.1em] text-sm py-3.5 rounded-xl hover:bg-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
