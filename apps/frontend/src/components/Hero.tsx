"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { IconShield, IconAward, IconClock24 } from "./Icons";

/* ── Counter ───────────────────────────────────── */
function useCounter(target: number, dur = 2000, delay = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const s = performance.now();
      const tick = (n: number) => {
        const p = Math.min((n - s) / dur, 1);
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, dur, delay]);
  return v;
}

/* ── Particles ─────────────────────────────────── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let id: number;
    const pts: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const resize = () => { c.width = c.offsetWidth * devicePixelRatio; c.height = c.offsetHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio); };
    resize();
    for (let i = 0; i < 30; i++) pts.push({ x: Math.random() * c.offsetWidth, y: Math.random() * c.offsetHeight, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.15 + 0.03 });
    const draw = () => {
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
      for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = c.offsetWidth; if (p.x > c.offsetWidth) p.x = 0; if (p.y < 0) p.y = c.offsetHeight; if (p.y > c.offsetHeight) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill(); }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 100) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke(); } }
      id = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />;
}

/* ── Stats ──────────────────────────────────────── */
const STATS = [
  { icon: IconShield, num: 50, pre: "+", suf: "", label: "anos de experiência" },
  { icon: IconAward, num: 10, pre: "+", suf: "", label: "anos ISO 9001" },
  { icon: IconClock24, num: 24, pre: "", suf: "h", label: "atendimento" },
];

/* ── Hero ───────────────────────────────────────── */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setM({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  }, []);

  const c0 = useCounter(STATS[0].num, 2000, 1000);
  const c1 = useCounter(STATS[1].num, 1600, 1200);
  const c2 = useCounter(STATS[2].num, 1400, 1400);
  const counts = [c0, c1, c2];

  return (
    <div ref={ref} onMouseMove={onMove} className="relative min-h-[100dvh] md:h-[100dvh] overflow-hidden bg-[#001429]">

      {/* ═══ BACKGROUND ═══════════════════════════════ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001429] via-[#003966] to-[#002244]" />

      {/* Red diagonal slab — parallax (simplified on mobile) */}
      <div className="absolute top-[-20%] right-[-5%] w-[55%] md:w-[52%] h-[140%]" style={{ background: "linear-gradient(170deg, #DF040B, #a50308)", clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 8% 100%)", transform: `translate(${m.x * 15}px,${m.y * 8}px)`, transition: "transform .9s cubic-bezier(.16,1,.3,1)" }} />
      <div className="hidden md:block absolute top-[-20%] right-[-5%] w-[52%] h-[140%] opacity-20" style={{ background: "#600", clipPath: "polygon(29% 0%,100% 0%,100% 100%,9% 100%)", filter: "blur(60px)" }} />

      {/* White wedge — hidden on mobile */}
      <div className="hidden md:block absolute bottom-0 right-0 w-[38%] h-[44%] bg-white" style={{ clipPath: "polygon(45% 100%,100% 15%,100% 100%)", transform: `translate(${m.x * -8}px,${m.y * -5}px)`, transition: "transform 1.1s cubic-bezier(.16,1,.3,1)" }} />

      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,transparent 1px,transparent 100px),repeating-linear-gradient(90deg,#fff 0px,transparent 1px,transparent 100px)" }} />

      {/* Geo X shapes — hidden on mobile */}
      <div className="hidden md:block absolute -top-24 -right-24 w-[600px] h-[600px] opacity-[0.03] pointer-events-none" style={{ animation: "heroSpin 70s linear infinite" }}>
        <div className="absolute inset-0 rounded-[4rem] bg-white rotate-45" /><div className="absolute inset-0 rounded-[4rem] bg-white -rotate-45" />
      </div>
      <div className="hidden md:block absolute -bottom-32 -left-32 w-[350px] h-[350px] opacity-[0.02] pointer-events-none" style={{ animation: "heroSpin 50s linear infinite reverse" }}>
        <div className="absolute inset-0 rounded-[2.5rem] bg-red rotate-45" /><div className="absolute inset-0 rounded-[2.5rem] bg-red -rotate-45" />
      </div>

      {/* Scan line — hidden on mobile */}
      <div className="hidden md:block absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" style={{ animation: "heroScan 7s ease-in-out infinite" }} />

      {/* Particles — hidden on mobile for performance */}
      <div className="hidden md:block"><Particles /></div>

      {/* ═══ DIESEL HEART — hidden on mobile, shown on md+ ════ */}
      <div
        className={`hidden md:block absolute right-[-8%] lg:right-[-4%] xl:right-[2%] top-1/2 transition-all duration-[1.2s] ease-out ${on ? "opacity-100 translate-y-[-50%] scale-100" : "opacity-0 translate-y-[-45%] scale-[0.92]"}`}
        style={{ transitionDelay: "400ms" }}
      >
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[90px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(223,4,11,0.45) 0%, rgba(0,57,102,0.2) 60%, transparent 80%)", animation: "heroPulse 4s ease-in-out infinite" }} />

        {/* Orbit rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-dashed border-white/[0.04] rounded-full pointer-events-none" style={{ animation: "heroSpin 100s linear infinite" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-dashed border-white/[0.03] rounded-full pointer-events-none" style={{ animation: "heroSpin 140s linear infinite reverse" }} />

        {/* Orbiting dots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none" style={{ animation: "heroSpin 22s linear infinite" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red/50 rounded-full blur-[1px]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none" style={{ animation: "heroSpin 30s linear infinite reverse" }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />
        </div>

        {/* Radial lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-[0.05]">
          {[...Array(12)].map((_, i) => <div key={i} className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-white/70 to-transparent origin-left" style={{ width: "50%", transform: `rotate(${i * 30}deg)` }} />)}
        </div>

        {/* Image */}
        <div
          className="relative w-[400px] h-[400px] md:w-[470px] md:h-[470px] lg:w-[540px] lg:h-[540px] xl:w-[550px] xl:h-[550px]"
          style={{ animation: "heroFloat 6s ease-in-out infinite", transform: `translate(${m.x * -10}px,${m.y * -7}px)`, transition: "transform .7s cubic-bezier(.16,1,.3,1)" }}
        >
          <Image
            src="/images/diesel-heart.png"
            alt="Coração diesel mecânico — engenharia Águia Diesel"
            fill
            className="object-contain"
            style={{ filter: "contrast(1.12) saturate(1.15) brightness(1.06) drop-shadow(0 0 80px rgba(223,4,11,0.25)) drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}
            priority
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ animation: "heroSheen 6s ease-in-out infinite" }}>
            <div className="absolute -top-full -left-1/2 w-[200%] h-[200%] opacity-[0.05]" style={{ background: "linear-gradient(110deg, transparent 42%, rgba(255,255,255,0.9) 46%, rgba(255,255,255,0.3) 50%, transparent 54%)" }} />
          </div>
        </div>

        {/* Tags */}
        <div className={`absolute -top-[5%] -right-[8%] bg-[#0B1220]/60 backdrop-blur-xl border border-white/[0.1] rounded-xl px-4 py-2.5 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`} style={{ transitionDelay: "1.2s", animation: "heroTagA 5s ease-in-out infinite" }}>
          <span className="text-[0.55rem] text-white/35 font-bold tracking-[0.18em] uppercase block">Bancada</span>
          <span className="text-white font-[var(--font-display)] font-bold text-sm tracking-wider leading-tight">BOSCH EPS 708</span>
        </div>
        <div className={`absolute top-[42%] -left-[12%] bg-[#0B1220]/60 backdrop-blur-xl border border-white/[0.1] rounded-xl px-4 py-2.5 transition-all duration-700 ${on ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`} style={{ transitionDelay: "1.4s", animation: "heroTagB 6s ease-in-out infinite" }}>
          <span className="text-[0.55rem] text-white/35 font-bold tracking-[0.18em] uppercase block">Sistemas</span>
          <span className="text-red font-[var(--font-display)] font-bold text-sm tracking-wider leading-tight">COMMON RAIL</span>
        </div>
        <div className={`absolute -bottom-[6%] left-1/2 -translate-x-1/2 bg-[#0B1220]/60 backdrop-blur-xl border border-white/[0.1] rounded-xl px-4 py-2.5 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`} style={{ transitionDelay: "1.6s", animation: "heroTagC 5.5s ease-in-out infinite" }}>
          <span className="text-[0.55rem] text-white/35 font-bold tracking-[0.18em] uppercase block text-center">Diagnóstico</span>
          <span className="text-white font-[var(--font-display)] font-bold text-sm tracking-wider leading-tight">HEUI · EUI · CR</span>
        </div>
      </div>

      {/* ═══ MOBILE HERO IMAGE — small centered version ════ */}
      <div className="md:hidden relative z-10 flex justify-center pt-24 pb-2 px-6">
        <div className="relative w-[200px] h-[200px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full blur-[50px] pointer-events-none bg-red/30" />
          <Image
            src="/images/diesel-heart.png"
            alt="Coração diesel mecânico — engenharia Águia Diesel"
            fill
            className="object-contain"
            style={{ filter: "contrast(1.12) saturate(1.15) brightness(1.06) drop-shadow(0 0 40px rgba(223,4,11,0.3))" }}
            priority
          />
        </div>
      </div>

      {/* ═══ TEXT CONTENT ══════════════════════════════ */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 md:h-full flex items-center">
        <div className="max-w-[560px] xl:max-w-[620px] py-8 md:py-20 lg:py-12 md:text-left text-center mx-auto md:mx-0">

          <div className={`inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur border border-white/[0.08] rounded-full px-4 py-2 mb-5 md:mb-7 transition-all duration-600 ${on ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inset-0 rounded-full bg-red opacity-75" /><span className="relative rounded-full h-2 w-2 bg-red inline-flex" /></span>
            <span className="text-white/70 text-[0.65rem] font-semibold tracking-[0.2em] uppercase">Do laboratório à estrada</span>
          </div>

          <h1 className={`font-[var(--font-display)] text-white font-extrabold uppercase tracking-[0.02em] leading-[0.94] mb-4 md:mb-6 transition-all duration-700 text-[1.75rem] sm:text-[3.4rem] lg:text-[4rem] xl:text-[4.6rem] ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "100ms" }}>
            Diagnóstico e{" "}
            <span className="relative whitespace-nowrap">
              <span className="text-red">Tecnologia</span>
              <span className={`absolute -bottom-1 left-0 h-[3px] bg-red/50 rounded-full transition-all duration-[1.2s] ${on ? "w-full" : "w-0"}`} style={{ transitionDelay: "900ms" }} />
            </span>
            <br />
            em Sistemas Diesel
          </h1>

          <p className={`text-white/50 text-sm md:text-base sm:text-lg lg:text-xl leading-relaxed mb-6 md:mb-9 max-w-[480px] mx-auto md:mx-0 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "200ms" }}>
            Serviços, testes e manutenção com infraestrutura de laboratório e atendimento especializado há mais de 50 anos.
          </p>

          <div className={`flex flex-col md:flex-row flex-wrap gap-3 mb-6 md:mb-8 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "300ms" }}>
            <a href="#agendamento" className="group relative btn btn-primary !px-6 md:!px-8 !py-3 md:!py-3.5 !rounded-xl overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Agendar Serviço
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff1a1a] to-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a href="#emergencia" className="group btn !px-5 md:!px-7 !py-3 md:!py-3.5 !rounded-xl !bg-white/[0.06] !border-white/[0.12] text-white hover:!bg-white/[0.12] hover:!border-white/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inset-0 rounded-full bg-red opacity-60" /><span className="relative rounded-full h-2 w-2 bg-red inline-flex" /></span>
              Emergência 24h
            </a>
            {/* Loja Online link hidden on mobile */}
            <a href="https://loja.aguiadiesel.com.br/loja/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex group btn !bg-transparent !border-0 text-white/30 hover:text-white !px-3">
              <svg className="w-4 h-4 mr-1 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Loja Online →
            </a>
          </div>

          <div className={`flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 pb-8 md:pb-0 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "450ms" }}>
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <div className="w-8 md:w-9 h-8 md:h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-red">
                  <s.icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </div>
                <div>
                  <span className="font-[var(--font-display)] text-white font-extrabold text-lg md:text-xl tracking-wider leading-none block">
                    {s.pre}{counts[i]}{s.suf}
                  </span>
                  <span className="text-white/30 text-[0.55rem] md:text-[0.6rem] tracking-wider font-medium uppercase">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint — hidden on mobile */}
      <div className={`hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 transition-all duration-700 ${on ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1.5s" }}>
        <span className="text-white/25 text-[0.6rem] font-bold tracking-[0.25em] uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/15 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/40 rounded-full" style={{ animation: "scrollDot 2s ease-in-out infinite" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes heroSpin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes heroFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes heroPulse { 0%,100% { opacity:.3; transform:translate(-50%,-50%) scale(1); } 50% { opacity:.5; transform:translate(-50%,-50%) scale(1.12); } }
        @keyframes heroScan { 0% { top:-5%; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { top:105%; opacity:0; } }
        @keyframes heroSheen { 0%,100% { transform:translateX(-100%) rotate(15deg); } 50% { transform:translateX(100%) rotate(15deg); } }
        @keyframes heroTagA { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
        @keyframes heroTagB { 0%,100% { transform:translateY(0); } 50% { transform:translateY(5px) translateX(3px); } }
        @keyframes heroTagC { 0%,100% { transform:translateX(-50%); } 50% { transform:translateX(-50%) translateY(7px); } }
        @keyframes scrollDot { 0%,100% { transform:translateY(0); opacity:1; } 50% { transform:translateY(6px); opacity:0.3; } }
      `}</style>
    </div>
  );
}
