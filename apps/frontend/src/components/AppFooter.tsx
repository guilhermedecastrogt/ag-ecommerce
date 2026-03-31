import Image from "next/image";
import Link from "next/link";

const COL_LOJA = [
  { label: "Todos os Produtos", href: "/loja" },
  { label: "Injetores", href: "/loja?categoria=injetores" },
  { label: "Bombas", href: "/loja?categoria=bombas" },
  { label: "Módulos", href: "/loja?categoria=modulos" },
  { label: "Sensores", href: "/loja?categoria=sensores" },
];

const COL_EMPRESA = [
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Serviços", href: "/servicos" },
  { label: "Laboratórios", href: "/laboratorios" },
  { label: "Marcas", href: "/marcas" },
  { label: "FAQ", href: "/faq" },
];

const COL_ATENDIMENTO = [
  { label: "Agendamento", href: "/agendamento" },
  { label: "Emergência 24h", href: "/emergencia" },
  { label: "Contato", href: "/contato" },
];

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[0.6rem] font-extrabold tracking-[0.25em] uppercase text-white/30 mb-5">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors duration-150 leading-none">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppFooter() {
  return (
    <footer className="relative bg-[#001429] overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Top red accent line */}
      <div className="relative h-[3px] bg-gradient-to-r from-transparent via-red to-transparent opacity-60" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image src="/logo-aguia.png" alt="Águia Diesel" width={110} height={40} style={{ height: "auto" }} />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-[260px] mb-6">
              Diagnóstico e excelência em diesel, do laboratório à estrada. Mais de 50 anos de experiência.
            </p>
            <div className="space-y-2">
              <a href="tel:+556240086363" className="flex items-center gap-2.5 text-white/50 text-sm hover:text-white transition-colors group">
                <span className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-red/20 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.19 12.9 19.79 19.79 0 012.12 4.3 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                </span>
                (62) 4008-6363
              </a>
              <a href="mailto:contato@aguiadiesel.com.br" className="flex items-center gap-2.5 text-white/50 text-sm hover:text-white transition-colors group">
                <span className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-red/20 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                </span>
                contato@aguiadiesel.com.br
              </a>
              <div className="flex items-center gap-2.5 text-white/30 text-sm">
                <span className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                Goiânia — GO
              </div>
            </div>
          </div>

          <FooterCol title="Loja" links={COL_LOJA} />
          <FooterCol title="Empresa" links={COL_EMPRESA} />
          <FooterCol title="Atendimento" links={COL_ATENDIMENTO} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs tracking-wider">
            &copy; Águia Diesel — 2026. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            <span className="text-white/20 text-xs">Sistema operacional</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
