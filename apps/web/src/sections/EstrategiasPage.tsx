import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { usePublishContext } from "../hooks/usePublishContext";
import { INVESTOR_PHILOSOPHIES, INVESTMENT_GUIDE, STRATEGIES } from "../data/strategies";

const HORIZON_COLOR: Record<string, string> = {
  "Corto plazo": "text-neon-red border-neon-red/30",
  "Mediano plazo": "text-neon-gold border-neon-gold/30",
  "Largo plazo": "text-neon-green border-neon-green/30",
};

export function EstrategiasPage() {
  usePublishContext("estrategias", { totalSteps: INVESTMENT_GUIDE.length, totalStrategies: STRATEGIES.length });

  return (
    <div>
      <SectionHeader
        title="Estrategias & Cómo Invertir"
        subtitle="Las estrategias de inversión más usadas en cripto, explicadas a fondo con ejemplos numéricos — filosofías de inversores reconocidos, y una guía práctica de 6 pasos para empezar."
      />

      <h2 className="text-lg font-bold text-white mb-3">Estrategias, explicadas a fondo</h2>
      <p className="text-sm text-slate-400 mb-5 max-w-3xl">
        No existe "la mejor estrategia" universal — existe la mejor estrategia para tu horizonte de tiempo, tu
        tolerancia al riesgo y cuánto tiempo estás dispuesto a dedicarle. Cada una de estas tiene un ejemplo numérico
        concreto para que entiendas exactamente cómo funciona antes de decidir si te sirve.
      </p>
      <div className="space-y-4 mb-10">
        {STRATEGIES.map((s) => (
          <div key={s.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-slate-500">{s.oneLine}</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <span className={`badge text-[10px] ${HORIZON_COLOR[s.horizon]}`}>{s.horizon}</span>
                <span className="badge text-[10px] text-slate-400 border-void-border">ESFUERZO {s.effort.toUpperCase()}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-1.5">CÓMO FUNCIONA</div>
                <p className="text-sm text-slate-300 leading-relaxed">{s.howItWorks}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold tracking-widest text-neon-green mb-1.5">EJEMPLO NUMÉRICO</div>
                <p className="text-sm text-slate-300 leading-relaxed">{s.example}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-[10px] font-mono font-bold tracking-widest text-neon-green mb-1.5">VENTAJAS</div>
                <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                  {s.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold tracking-widest text-neon-red mb-1.5">DESVENTAJAS</div>
                <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                  {s.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-void-soft rounded-lg p-3 text-xs text-slate-400">
              <span className="text-slate-500 font-mono">PARA QUIÉN ES: </span>
              {s.bestFor}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-3">Filosofías de inversión</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {INVESTOR_PHILOSOPHIES.map((inv) => (
          <div key={inv.name} className="panel p-5">
            <div className="font-semibold text-white">{inv.name}</div>
            <div className="text-xs text-neon-blue font-mono mb-2">{inv.apodo}</div>
            <p className="text-sm text-slate-400">{inv.filosofia}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-3">Guía práctica de 6 pasos</h2>
      <div className="space-y-3 mb-6">
        {INVESTMENT_GUIDE.map((step) => (
          <div key={step.step} className="panel p-5 flex gap-4">
            <div className="w-9 h-9 shrink-0 rounded-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-mono font-bold flex items-center justify-center">
              {step.step}
            </div>
            <div>
              <div className="font-semibold text-white mb-1">{step.title}</div>
              <p className="text-sm text-slate-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
