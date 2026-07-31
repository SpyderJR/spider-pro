import { useState, type ReactNode } from "react";
import { INDICATOR_GUIDES, type IndicatorGuide } from "../data/indicatorGuides";

const CATEGORIES = ["Todos", "Tendencia", "Momentum", "Volatilidad", "Volumen"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_STYLE: Record<IndicatorGuide["category"], string> = {
  Tendencia: "text-neon-blue border-neon-blue/30 bg-neon-blue/5",
  Momentum: "text-neon-green border-neon-green/30 bg-neon-green/5",
  Volatilidad: "text-neon-gold border-neon-gold/30 bg-neon-gold/5",
  Volumen: "text-neon-red border-neon-red/30 bg-neon-red/5",
};

export function IndicatorAcademy() {
  const [category, setCategory] = useState<Category>("Todos");
  const [openId, setOpenId] = useState<string | null>(INDICATOR_GUIDES[0]?.id ?? null);

  const guides = INDICATOR_GUIDES.filter((g) => category === "Todos" || g.category === category);

  return (
    <div className="mb-8">
      <div className="panel p-6 mb-4 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-neon-green/10 blur-3xl rounded-full" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎓</span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Academia de Indicadores
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-xl">
              Los {INDICATOR_GUIDES.length} indicadores disponibles en esta sección — qué miden, su fórmula,
              un ejemplo real, cuándo confiar en ellos y los errores más comunes al usarlos.
            </p>
          </div>
        </div>

        <div className="relative flex flex-wrap gap-2 mt-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all ${
                category === c
                  ? "border-neon-green/50 text-neon-green bg-neon-green/10 shadow-neon-green"
                  : "border-void-border text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              {c}
              {c !== "Todos" && (
                <span className="ml-1.5 text-slate-600">
                  {INDICATOR_GUIDES.filter((g) => g.category === c).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {guides.map((guide) => (
          <AcademyCard
            key={guide.id}
            guide={guide}
            isOpen={openId === guide.id}
            onToggle={() => setOpenId(openId === guide.id ? null : guide.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AcademyCard({
  guide,
  isOpen,
  onToggle,
}: {
  guide: IndicatorGuide;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`panel overflow-hidden border transition-colors ${
        isOpen ? "border-neon-green/30" : "border-void-border"
      }`}
    >
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-5 text-left">
        <div className="w-10 h-10 shrink-0 rounded-lg bg-void-soft border border-void-border flex items-center justify-center text-lg text-slate-300">
          {guide.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{guide.title}</span>
            <span className={`badge text-[10px] ${CATEGORY_STYLE[guide.category]}`}>{guide.category}</span>
          </div>
          {!isOpen && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{guide.what}</p>}
        </div>
        <span className={`text-slate-500 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 space-y-4 border-t border-void-border pt-4">
          <Section label="Qué mide">
            <p className="text-sm text-slate-300 leading-relaxed">{guide.what}</p>
          </Section>

          <Section label="Fórmula">
            <code className="block text-xs value-mono text-neon-blue bg-void-soft border border-void-border rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre">
              {guide.formula}
            </code>
          </Section>

          <Section label="Cómo leerlo">
            <p className="text-sm text-slate-300 leading-relaxed">{guide.howToRead}</p>
          </Section>

          <Section label="Ejemplo práctico">
            <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-neon-gold/40 pl-3">
              {guide.example}
            </p>
          </Section>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-neon-green/5 border border-neon-green/20 rounded-lg p-3.5">
              <div className="text-[11px] font-mono text-neon-green mb-1.5 tracking-wide">✓ CUÁNDO FUNCIONA MEJOR</div>
              <p className="text-xs text-slate-300 leading-relaxed">{guide.bestConditions}</p>
            </div>
            <div className="bg-neon-red/5 border border-neon-red/20 rounded-lg p-3.5">
              <div className="text-[11px] font-mono text-neon-red mb-1.5 tracking-wide">⚠ LIMITACIONES</div>
              <p className="text-xs text-slate-300 leading-relaxed">{guide.limitations}</p>
            </div>
          </div>

          <Section label="Señales clave">
            <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
              {guide.signals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>

          <Section label="Errores comunes al usarlo">
            <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
              {guide.commonMistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-mono text-slate-500 tracking-widest mb-1.5">{label.toUpperCase()}</div>
      {children}
    </div>
  );
}
