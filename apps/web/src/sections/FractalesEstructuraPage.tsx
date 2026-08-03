import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { LiveFractalChart } from "../components/fractals/diagrams/LiveFractalChart";
import { FractalesSection } from "./fractales/FractalesSection";
import { AlligatorSection } from "./fractales/AlligatorSection";
import { ZigzagSection } from "./fractales/ZigzagSection";
import { PivotsSection } from "./fractales/PivotsSection";
import { OscillatorsSection } from "./fractales/OscillatorsSection";
import { MarketStructureSection } from "./fractales/MarketStructureSection";
import { CombosSection } from "./fractales/CombosSection";
import { ComparisonTable } from "./fractales/ComparisonTable";
import { usePublishContext } from "../hooks/usePublishContext";

const NAV_ANCHORS = [
  { id: "fractales", label: "Fractales", icon: "〽" },
  { id: "alligator", label: "Alligator", icon: "🐊" },
  { id: "zigzag", label: "ZigZag", icon: "⚡" },
  { id: "pivots", label: "Pivots", icon: "⌗" },
  { id: "osciladores", label: "%R + AO", icon: "≋" },
  { id: "estructura", label: "Estructura", icon: "⌬" },
  { id: "combinaciones", label: "Cómo combinarlos", icon: "🔗" },
];

export function FractalesEstructuraPage() {
  usePublishContext("fractales-estructura", {
    section: "guía educativa de fractales, alligator, zigzag, pivots, osciladores y estructura de mercado",
  });

  return (
    <div>
      <SectionHeader
        title="Fractales & Estructura de Mercado"
        subtitle="Guía completa de indicadores de giro y estructura: qué son, cómo funcionan, cuándo usarlos y cómo combinarlos."
      />

      <div className="panel border border-neon-blue/30 bg-neon-blue/5 p-5 mb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-blue mb-2">
          ANTES DE EMPEZAR
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">
          Ninguno de los 6 indicadores de esta página <strong>predice el futuro</strong>. Todos leen la{" "}
          <strong>estructura del precio que ya ocurrió</strong> — máximos, mínimos y el orden en que aparecen
          — para describir dónde está parado el mercado ahora mismo. Ninguno debe usarse solo: cada uno cumple
          un rol específico (contexto, señal o confirmación), y la sección "Cómo combinarlos" al final de esta
          página explica exactamente cómo ensamblarlos.
        </p>
      </div>

      <div className="panel p-4 mb-8">
        <div className="text-xs font-mono text-slate-500 mb-2">FRACTALES EN VIVO — BTC</div>
        <LiveFractalChart />
      </div>

      <nav className="flex flex-wrap gap-2 mb-10 sticky top-[52px] z-20 bg-void/95 backdrop-blur py-2 -mx-1 px-1">
        {NAV_ANCHORS.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-void-border text-slate-400 hover:border-neon-blue/50 hover:text-neon-blue transition-colors"
          >
            <span>{a.icon}</span>
            {a.label}
          </a>
        ))}
      </nav>

      <FractalesSection />
      <AlligatorSection />
      <ZigzagSection />
      <PivotsSection />
      <OscillatorsSection />
      <MarketStructureSection />
      <CombosSection />
      <ComparisonTable />

      <Disclaimer text="Esta información es contexto educativo, no asesoría financiera (NFA — Not Financial Advice). Ninguna señal técnica es una recomendación de compra o venta." />
    </div>
  );
}
