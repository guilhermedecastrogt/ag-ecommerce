import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-neutral-light flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[520px] text-center">
        {/* Ghost 404 */}
        <div className="relative select-none mb-2">
          <span
            className="font-[var(--font-display)] font-extrabold text-[clamp(7rem,22vw,11rem)] leading-none text-blue/[0.06] block"
          >
            404
          </span>
          {/* Red slash overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-0.5 h-[65%] bg-red/40 rotate-[20deg]" />
          </div>
        </div>

        {/* Red overline */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red/40" />
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/60">
            Página não encontrada
          </p>
          <div className="h-px w-8 bg-red/40" />
        </div>

        <h1 className="font-[var(--font-display)] text-blue text-2xl font-extrabold uppercase tracking-wide mb-3">
          Endereço inválido
        </h1>
        <p className="text-blue/45 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          A página que você procura não existe ou foi removida. Navegue pelo menu ou volte ao início.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue text-white font-extrabold uppercase tracking-[0.08em] text-sm px-6 py-3.5 rounded-xl hover:bg-red transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Ir para o início
          </Link>
          <Link
            href="/loja"
            className="inline-flex items-center justify-center gap-2 border border-blue/20 text-blue font-bold uppercase tracking-[0.08em] text-sm px-6 py-3.5 rounded-xl hover:bg-blue hover:text-white transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
            Ver loja
          </Link>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {[
            { href: "/servicos", label: "Serviços" },
            { href: "/agendamento", label: "Agendamento" },
            { href: "/contato", label: "Contato" },
            { href: "/faq", label: "FAQ" },
            { href: "/quem-somos", label: "Quem Somos" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-bold text-blue/35 hover:text-blue uppercase tracking-wider transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
