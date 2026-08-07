import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { usePublishContext } from "../hooks/usePublishContext";
import { StopLossExplainer } from "./riskManagement/StopLossExplainer";
import { PositionSizeCalculator } from "./riskManagement/PositionSizeCalculator";
import { RiskRewardCalculator } from "./riskManagement/RiskRewardCalculator";
import { StreakSimulator } from "./riskManagement/StreakSimulator";
import { MonteCarloSimulator } from "./riskManagement/MonteCarloSimulator";
import { PsychologySection } from "./riskManagement/PsychologySection";
import { SurvivalRules } from "./riskManagement/SurvivalRules";

const NAV_ANCHORS = [
  { id: "que-es-stop-loss", label: "Qué es un Stop Loss", icon: "🎯" },
  { id: "tamano-posicion", label: "Tamaño de posición", icon: "📐" },
  { id: "riesgo-beneficio", label: "Riesgo/Beneficio", icon: "⚖" },
  { id: "simulador-rachas", label: "Simulador de rachas", icon: "📉" },
  { id: "monte-carlo", label: "Monte Carlo", icon: "🎲" },
  { id: "psicologia", label: "Psicología", icon: "🧠" },
  { id: "reglas-supervivencia", label: "Reglas de supervivencia", icon: "🛡" },
];

export function RiskManagementPage() {
  usePublishContext("gestion-de-riesgo", {
    section: "calculadoras de gestión de riesgo, simulador de rachas y psicología del trading",
  });

  return (
    <div>
      <SectionHeader
        title="Gestión de Riesgo"
        subtitle="La decisión que más importa en cada trade — cómo calcularla y cómo no dejar que la cabeza la arruine."
      />

      <div className="panel border border-neon-red/30 bg-neon-red/5 p-5 mb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-red mb-2">POR QUÉ ESTA PÁGINA IMPORTA MÁS QUE CUALQUIER INDICADOR</div>
        <p className="text-slate-200 text-sm leading-relaxed">
          Puedes tener la mejor estrategia técnica del dashboard y aun así quebrar la cuenta si arriesgas mal.
          Al revés, una estrategia mediocre con buena gestión de riesgo sobrevive lo suficiente como para
          mejorar con el tiempo. Esta página es matemática pura y psicología aplicada — sin eso, todo lo
          demás en Spider Pro es decoración.
        </p>
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

      <StopLossExplainer />
      <PositionSizeCalculator />
      <RiskRewardCalculator />
      <StreakSimulator />
      <MonteCarloSimulator />
      <PsychologySection />
      <SurvivalRules />

      <Disclaimer text="Esta información es contexto educativo, no asesoría financiera (NFA — Not Financial Advice). Ninguna calculadora de esta página es una recomendación de compra o venta." />
    </div>
  );
}
