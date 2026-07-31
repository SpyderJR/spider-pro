import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { usePublishContext } from "../hooks/usePublishContext";
import { INVESTOR_PHILOSOPHIES, INVESTMENT_GUIDE } from "../data/investors";

export function EstrategiasPage() {
  usePublishContext("estrategias", { totalSteps: INVESTMENT_GUIDE.length });

  return (
    <div>
      <SectionHeader
        title="Estrategias & Cómo Invertir"
        subtitle="Filosofías de inversores reconocidos y una guía práctica de 6 pasos para empezar."
      />

      <h2 className="text-lg font-bold text-white mb-3">Filosofías de inversión</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
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
