import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { useMarketCoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent, formatUsd } from "../lib/format";
import { HALVINGS, NEXT_HALVING, CYCLE_PHASES } from "../data/halvings";

export function HalvingsPage() {
  const coins = useMarketCoins();
  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");

  const lastHalving = HALVINGS.at(-1)!;
  const liveRoi =
    btc && lastHalving.priceAtHalving
      ? ((btc.price - lastHalving.priceAtHalving) / lastHalving.priceAtHalving) * 100
      : null;

  const monthsSinceLastHalving =
    (Date.now() - new Date(lastHalving.date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  const currentPhase =
    CYCLE_PHASES.find((p) => {
      const [minStr, maxStr] = p.monthsFromHalving.replace("meses", "").replace("+", "-999").split("–");
      const min = Number(minStr);
      const max = Number(maxStr);
      return monthsSinceLastHalving >= min && monthsSinceLastHalving <= max;
    }) ?? CYCLE_PHASES[0];

  usePublishContext("halvings", {
    lastHalvingDate: lastHalving.date,
    priceAtLastHalving: lastHalving.priceAtHalving,
    currentBtcPrice: btc?.price ?? null,
    liveRoiSinceHalvingPercent: liveRoi,
    currentPhase: currentPhase?.phase ?? null,
    nextHalvingEstimate: NEXT_HALVING.estimatedDate,
  });

  return (
    <div>
      <SectionHeader
        title="Halvings BTC"
        subtitle="Línea de tiempo de los halvings históricos, proyección del próximo y guía de decisión según la fase del ciclo."
      />

      <div className="panel p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-mono text-slate-500">ROI EN VIVO DESDE EL ÚLTIMO HALVING</div>
        </div>
        <div className={`value-mono text-2xl font-bold ${liveRoi !== null && liveRoi >= 0 ? "text-neon-green" : "text-neon-red"}`}>
          {liveRoi !== null ? formatPercent(liveRoi) : "—"}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Desde {formatUsd(lastHalving.priceAtHalving ?? 0)} el {lastHalving.date} hasta el precio actual.
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Línea de tiempo</div>
        <div className="space-y-4">
          {HALVINGS.map((h) => (
            <div key={h.number} className="flex gap-4 items-start">
              <div className="w-16 shrink-0 text-xs font-mono text-neon-gold">#{h.number}</div>
              <div className="flex-1 border-b border-void-border/60 pb-3">
                <div className="text-sm text-slate-200 font-medium">{h.date}</div>
                <div className="text-xs text-slate-500 value-mono">
                  Bloque {h.blockHeight.toLocaleString()} · recompensa {h.rewardBefore} → {h.rewardAfter} BTC
                </div>
                <div className="text-xs text-slate-500 value-mono mt-1">
                  Precio en halving: {h.priceAtHalving ? formatUsd(h.priceAtHalving) : "—"}
                  {h.athFollowing && ` · ATH posterior: ${formatUsd(h.athFollowing)} (${h.daysToAth}d después)`}
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-4 items-start opacity-60">
            <div className="w-16 shrink-0 text-xs font-mono text-neon-blue">#{NEXT_HALVING.number}</div>
            <div className="flex-1">
              <div className="text-sm text-slate-200 font-medium">
                Proyectado: {NEXT_HALVING.estimatedDate}
              </div>
              <div className="text-xs text-slate-500 value-mono">
                Bloque estimado {NEXT_HALVING.estimatedBlockHeight.toLocaleString()} · recompensa →{" "}
                {NEXT_HALVING.rewardAfter} BTC
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Guía de decisión según la fase del ciclo</div>
        <div className="space-y-3">
          {CYCLE_PHASES.map((phase) => (
            <div
              key={phase.phase}
              className={`rounded-lg p-4 border ${
                phase.phase === currentPhase?.phase
                  ? "border-neon-green/40 bg-neon-green/5"
                  : "border-void-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-white text-sm">{phase.phase}</div>
                <div className="text-[11px] font-mono text-slate-500">{phase.monthsFromHalving}</div>
              </div>
              <p className="text-xs text-slate-400 mb-1">{phase.description}</p>
              <p className="text-xs text-slate-500 italic">{phase.historicalBehavior}</p>
              {phase.phase === currentPhase?.phase && (
                <div className="text-[11px] font-mono text-neon-green mt-2">◈ Fase actual estimada</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Disclaimer text="El comportamiento pasado de los ciclos no garantiza resultados futuros. Esto es contexto histórico, no una predicción ni recomendación de inversión (NFA)." />
    </div>
  );
}
