import type { ReactNode } from "react";

interface CombineWith {
  label: string;
  role: string;
  reason: string;
}

interface IndicatorCardProps {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  diagram: ReactNode;
  whatIsIt: ReactNode;
  howItWorks: ReactNode;
  whenTimeframes: string;
  whenConditions: string;
  whenAvoid: string;
  strategies: string[];
  combinesWith: CombineWith[];
  mistakes: string[];
}

export function IndicatorCard({
  id,
  icon,
  title,
  tagline,
  diagram,
  whatIsIt,
  howItWorks,
  whenTimeframes,
  whenConditions,
  whenAvoid,
  strategies,
  combinesWith,
  mistakes,
}: IndicatorCardProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-void-soft border border-void-border flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-xs text-slate-500">{tagline}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card label="¿Qué es?">
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">{whatIsIt}</div>
        </Card>

        <Card label="Anatomía visual">
          <div className="bg-void-soft rounded-lg p-4 border border-void-border">{diagram}</div>
        </Card>

        <Card label="Cómo funciona" accent="blue">
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">{howItWorks}</div>
        </Card>

        <Card label="Cuándo usarlo">
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-[11px] font-mono text-neon-blue mb-1">TEMPORALIDADES</div>
              <p className="text-slate-400">{whenTimeframes}</p>
            </div>
            <div>
              <div className="text-[11px] font-mono text-neon-gold mb-1">CONDICIONES IDEALES</div>
              <p className="text-slate-400">{whenConditions}</p>
            </div>
            <div>
              <div className="text-[11px] font-mono text-neon-red mb-1">CUÁNDO EVITARLO</div>
              <p className="text-slate-400">{whenAvoid}</p>
            </div>
          </div>
        </Card>

        <Card label="Estrategias prácticas">
          <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
            {strategies.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>

        <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-4">
          <div className="text-[11px] font-mono text-neon-blue mb-2 tracking-wide">🔗 CÓMO SE COMBINA</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {combinesWith.map((c) => (
              <div key={c.label} className="text-sm">
                <span className="font-semibold text-slate-200">{c.label}</span>
                <span className="text-slate-500"> — {c.role}</span>
                <p className="text-slate-500 text-xs mt-0.5">{c.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <Card label="Errores comunes" accent="red">
          <ul className="space-y-1.5 text-sm text-slate-400">
            {mistakes.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-neon-red shrink-0">✕</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

function Card({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: "blue" | "red";
  children: ReactNode;
}) {
  const accentCls =
    accent === "blue" ? "text-neon-blue" : accent === "red" ? "text-neon-red" : "text-slate-500";
  return (
    <div className="panel p-5">
      <div className={`text-[11px] font-mono tracking-widest mb-3 ${accentCls}`}>{label.toUpperCase()}</div>
      {children}
    </div>
  );
}
