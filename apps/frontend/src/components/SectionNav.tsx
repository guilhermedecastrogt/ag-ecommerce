"use client";

interface SectionNavProps {
  sections: { id: string; label: string }[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  isDark: boolean;
}

export default function SectionNav({ sections, activeIndex, onNavigate, isDark }: SectionNavProps) {
  return (
    <nav className={`section-nav ${isDark ? "" : "light-mode"}`} aria-label="Navegação por seções">
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onNavigate(i)}
          className={`dot ${i === activeIndex ? "active" : ""}`}
          aria-label={`Ir para ${s.label}`}
          aria-current={i === activeIndex ? "true" : undefined}
        >
          <span className="dot-label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
