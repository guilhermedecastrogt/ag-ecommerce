"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CadastroPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/conta");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-63px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative bg-[#001429] flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-[40%] h-full bg-red/[0.06]" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0% 100%)" }} />

        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo-aguia.png" alt="Águia Diesel" width={110} height={40} style={{ height: "auto" }} priority />
          </Link>
        </div>

        <div className="relative z-10">
          <div className="w-10 h-[2px] bg-red mb-6" />
          <h2 className="font-[var(--font-display)] text-white text-4xl xl:text-5xl font-extrabold uppercase leading-[0.95] tracking-wide mb-4">
            Crie sua<br />
            <span className="text-red">conta</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Registre-se para comprar peças diesel com segurança e acompanhar seus pedidos.
          </p>
        </div>

        <div className="relative z-10 bg-white/5 rounded-xl p-5 border border-white/[0.06]">
          <p className="text-white/30 text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-3">Por que se cadastrar?</p>
          <ul className="space-y-2">
            {["Rastreie seus pedidos", "Histórico de compras completo", "Checkout mais rápido", "Cancelamento em 1 clique"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-3.5 h-3.5 text-red/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-neutral-light">
        <div className="w-full max-w-[420px]">
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/">
              <Image src="/logo-aguia.png" alt="Águia Diesel" width={100} height={36} style={{ height: "auto" }} />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide mb-1">
              Criar conta
            </h1>
            <p className="text-blue/50 text-sm">
              Já tem conta?{" "}
              <Link href="/auth/login" className="text-red font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red/5 border border-red/15 text-red text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Nome completo", type: "text", value: name, set: setName, placeholder: "João da Silva" },
              { label: "E-mail", type: "email", value: email, set: setEmail, placeholder: "seu@email.com" },
              { label: "Senha", type: "password", value: password, set: setPassword, placeholder: "Mínimo 6 caracteres" },
              { label: "Confirmar senha", type: "password", value: confirm, set: setConfirm, placeholder: "Repita a senha" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[0.7rem] font-extrabold text-blue/50 uppercase tracking-[0.12em] mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  required
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white border border-neutral-border rounded-xl px-4 py-3.5 text-sm text-blue placeholder-blue/25 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/8 transition-all"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue text-white font-extrabold uppercase tracking-[0.1em] text-sm py-4 rounded-xl hover:bg-red transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar minha conta
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
      </div>
    </div>
  );
}
