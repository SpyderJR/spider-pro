import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { CandleIcon } from "../components/CandleIcon";
import { usePublishContext } from "../hooks/usePublishContext";
import { CANDLE_PATTERNS } from "../data/candlePatterns";

const TIPO_STYLES: Record<string, string> = {
  alcista: "text-neon-green border-neon-green/40",
  bajista: "text-neon-red border-neon-red/40",
  neutral: "text-neon-gold border-neon-gold/40",
};

const FIABILIDAD_LABEL: Record<string, string> = {
  baja: "Fiabilidad baja",
  media: "Fiabilidad media",
  alta: "Fiabilidad alta",
};

export function VelasJaponesasPage() {
  usePublishContext("velas-japonesas", { totalPatterns: CANDLE_PATTERNS.length });

  return (
    <div>
      <SectionHeader
        title="Velas Japonesas"
        subtitle="Academia de patrones de velas: contexto, psicología de mercado, fiabilidad y cómo operarlos."
      />

      <div className="grid md:grid-cols-2 gap-4">
        {CANDLE_PATTERNS.map((pattern) => (
          <div key={pattern.id} className="panel p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="bg-void-soft rounded-lg p-2 shrink-0">
                <CandleIcon candles={pattern.candles} />
              </div>
              <div>
                <div className="font-semibold text-white">{pattern.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${TIPO_STYLES[pattern.tipo]}`}>{pattern.tipo}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {FIABILIDAD_LABEL[pattern.fiabilidad]}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">
                <span className="text-slate-300 font-medium">Contexto: </span>
                {pattern.contexto}
              </p>
              <p className="text-slate-400">
                <span className="text-slate-300 font-medium">Psicología: </span>
                {pattern.psicologia}
              </p>
              <p className="text-slate-400">
                <span className="text-slate-300 font-medium">Confirmación: </span>
                {pattern.confirmacion}
              </p>
              <p className="text-slate-400">
                <span className="text-slate-300 font-medium">Cómo operarlo: </span>
                {pattern.comoOperarlo}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
