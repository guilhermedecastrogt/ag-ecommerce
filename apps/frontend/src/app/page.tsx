"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ecommerce from "@/components/Ecommerce";
import Services from "@/components/Services";
import Laboratories from "@/components/Laboratories";
import Scheduling from "@/components/Scheduling";
import Emergency from "@/components/Emergency";
import Brands from "@/components/Brands";
import AboutUs from "@/components/AboutUs";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";

const SECTIONS = [
  { id: "inicio", label: "Início" },
  { id: "loja", label: "Produtos" },
  { id: "servicos", label: "Serviços" },
  { id: "laboratorios", label: "Labs" },
  { id: "agendamento", label: "Agendar" },
  { id: "emergencia", label: "24h" },
  { id: "marcas", label: "Marcas" },
  { id: "quem-somos", label: "Sobre" },
  { id: "contato", label: "Contato" },
  { id: "faq", label: "FAQ" },
  { id: "rodape", label: "Rodapé" },
];

/* Dark sections get light dots, light sections get dark dots */
const DARK_SECTIONS = new Set(["inicio", "agendamento", "emergencia", "rodape"]);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ── Intersection Observer for active section detection ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    const sections = container.querySelectorAll(".fp-section");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  /* ── Scroll progress tracking ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Navigate to section ── */
  const goTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const section = container.querySelectorAll(".fp-section")[index];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const isDark = DARK_SECTIONS.has(SECTIONS[activeIndex]?.id);

  return (
    <>
      {/* Progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <Header activeIndex={activeIndex} onNavigate={goTo} />

      <SectionNav
        sections={SECTIONS}
        activeIndex={activeIndex}
        onNavigate={goTo}
        isDark={isDark}
      />

      <div ref={containerRef} className="fp-container">
        <section id="inicio" className={`fp-section ${activeIndex === 0 ? "active" : ""}`}>
          <Hero />
        </section>

        <section id="loja" className={`fp-section ${activeIndex === 1 ? "active" : ""}`}>
          <Ecommerce />
        </section>

        <section id="servicos" className={`fp-section ${activeIndex === 2 ? "active" : ""}`}>
          <Services />
        </section>

        <section id="laboratorios" className={`fp-section ${activeIndex === 3 ? "active" : ""}`}>
          <Laboratories />
        </section>

        <section id="agendamento" className={`fp-section ${activeIndex === 4 ? "active" : ""}`}>
          <Scheduling />
        </section>

        <section id="emergencia" className={`fp-section ${activeIndex === 5 ? "active" : ""}`}>
          <Emergency />
        </section>

        <section id="marcas" className={`fp-section ${activeIndex === 6 ? "active" : ""}`}>
          <Brands />
        </section>

        <section id="quem-somos" className={`fp-section ${activeIndex === 7 ? "active" : ""}`}>
          <AboutUs />
        </section>

        <section id="contato" className={`fp-section ${activeIndex === 8 ? "active" : ""}`}>
          <Contact />
        </section>

        <section id="faq" className={`fp-section ${activeIndex === 9 ? "active" : ""}`}>
          <FAQ />
        </section>

        <section id="rodape" className={`fp-section ${activeIndex === 10 ? "active" : ""}`}>
          <Footer />
        </section>
      </div>
    </>
  );
}
