import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { useMarketCoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent, formatUsd } from "../lib/format";
import { HALVINGS, NEXT_HALVING, CYCLE_PHASES, gainToAthPercent, daysBetween } from "../data/halvings";

function addDays(iso: string, days: number): Date {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d;
}

function parsePhaseRange(range: string): [number, number] {
  const cleaned = range.replace(/\s*meses\s*/g, "");
  if (cleaned.endsWith("+")) return [Number(cleaned.slice(0, -1)), Infinity];
  const [min, max] = cleaned.split(/[–-]/).map(Number);
  return [min ?? 0, max ?? Infinity];
}

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
  const daysSinceLastHalving = Math.floor((Date.now() - new Date(lastHalving.date).getTime()) / (1000 * 60 * 60 * 24));

  const currentPhase =
    CYCLE_PHASES.find((p) => {
      const [min, max] = parsePhaseRange(p.monthsFromHalving);
      return monthsSinceLastHalving >= min && monthsSinceLastHalving <= max;
    }) ?? CYCLE_PHASES.at(-1);

  const priorCyclesWithAth = HALVINGS.filter((h) => h.daysToAth !== null);

  usePublishContext("halvings", {
    lastHalvingDate: lastHalving.date,
    priceAtLastHalving: lastHalving.priceAtHalving,
    currentBtcPrice: btc?.price ?? null,
    liveRoiSinceHalvingPercent: liveRoi,
    currentPhase: currentPhase?.phase ?? null,
    nextHalvingEstimate: NEXT_HALVING.estimatedDate,
    daysSinceLastHalving,
  });

  return (
    <div>
      <SectionHeader
        title="Halvings BTC"
        subtitle="Qué es un halving, cómo se comportaron los 4 ciclos anteriores lado a lado, y una proyección de a qué fecha equivaldría el pico de este ciclo si repite el patrón histórico."
      />

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-3">¿Qué es el halving y por qué le importa al precio?</div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            Bitcoin paga a los mineros una recompensa fija de BTC nuevos por cada bloque que agregan a la cadena.
            Cada 210,000 bloques (aproximadamente cada 4 años, dado que un bloque nuevo se mina cada ~10 minutos en
            promedio) esa recompensa se reduce a la mitad — de ahí "halving". La emisión de nuevos bitcoins hacia el
            mercado se corta al 50% de la noche a la mañana, mientras la demanda no cambia por el mismo evento.
          </p>
          <p>
            El argumento económico detrás del interés que genera cada halving es simple: si la demanda se mantiene
            igual o crece mientras la oferta nueva se reduce a la mitad, la presión de venta estructural de los
            mineros (que necesitan vender parte de lo que minan para cubrir costos) baja — un shock de oferta. Esto
            no garantiza una suba de precio por sí solo, pero es la tesis que el mercado ha repetido en los 3 ciclos
            completos anteriores.
          </p>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-mono text-slate-500">ROI EN VIVO DESDE EL ÚLTIMO HALVING</div>
        </div>
        <div className={`value-mono text-2xl font-bold ${liveRoi !== null && liveRoi >= 0 ? "text-neon-green" : "text-neon-red"}`}>
          {liveRoi !== null ? formatPercent(liveRoi) : "—"}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Desde {formatUsd(lastHalving.priceAtHalving ?? 0)} el {lastHalving.date} hasta el precio actual — {daysSinceLastHalving} días después del halving #{lastHalving.number}.
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-1">Tabla comparativa de los 4 halvings</div>
        <p className="text-xs text-slate-500 mb-4">Los mismos datos que la línea de tiempo, lado a lado para comparar ciclo contra ciclo.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-void-border">
                <th className="py-2 pr-3">Métrica</th>
                {HALVINGS.map((h) => (
                  <th key={h.number} className="py-2 pr-3 text-neon-gold">
                    Halving #{h.number}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-void-border/50">
                <td className="py-2 pr-3 text-slate-500">Fecha</td>
                {HALVINGS.map((h) => (
                  <td key={h.number} className="py-2 pr-3 text-slate-200">{h.date}</td>
                ))}
              </tr>
              <tr className="border-b border-void-border/50">
                <td className="py-2 pr-3 text-slate-500">Recompensa</td>
                {HALVINGS.map((h) => (
                  <td key={h.number} className="py-2 pr-3 value-mono text-slate-200">
                    {h.rewardBefore} → {h.rewardAfter} BTC
                  </td>
                ))}
              </tr>
              <tr className="border-b border-void-border/50">
                <td className="py-2 pr-3 text-slate-500">Precio en el halving</td>
                {HALVINGS.map((h) => (
                  <td key={h.number} className="py-2 pr-3 value-mono text-slate-200">
                    {h.priceAtHalving ? formatUsd(h.priceAtHalving) : "—"}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-void-border/50">
                <td className="py-2 pr-3 text-slate-500">ATH del ciclo</td>
                {HALVINGS.map((h) => (
                  <td key={h.number} className="py-2 pr-3 value-mono text-neon-green">
                    {h.athFollowing ? formatUsd(h.athFollowing) : "En curso"}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-void-border/50">
                <td className="py-2 pr-3 text-slate-500">Días hasta el ATH</td>
                {HALVINGS.map((h) => (
                  <td key={h.number} className="py-2 pr-3 value-mono text-slate-200">
                    {h.daysToAth ?? "—"}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-void-border/50">
                <td className="py-2 pr-3 text-slate-500">% de suba hasta el ATH</td>
                {HALVINGS.map((h) => {
                  const gain = gainToAthPercent(h);
                  return (
                    <td key={h.number} className="py-2 pr-3 value-mono text-neon-green">
                      {gain !== null ? `+${gain.toFixed(0)}%` : "—"}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2 pr-3 text-slate-500">Días desde el halving anterior</td>
                {HALVINGS.map((h, i) => (
                  <td key={h.number} className="py-2 pr-3 value-mono text-slate-400">
                    {i === 0 ? "—" : `${daysBetween(HALVINGS[i - 1]!.date, h.date).toLocaleString()}`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-1">
          Calculadora: ¿a qué fecha equivaldría el pico de este ciclo?
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Aplicando la cantidad exacta de días que tardó cada ciclo anterior en llegar a su ATH, contados desde el
          halving #{lastHalving.number} ({lastHalving.date}) — no es una predicción, es la misma matemática histórica
          aplicada a la fecha actual.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {priorCyclesWithAth.map((h) => {
            const projectedDate = addDays(lastHalving.date, h.daysToAth!);
            const daysFromToday = Math.round((projectedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (
              <div key={h.number} className="bg-void-soft rounded-lg p-4">
                <div className="text-[10px] font-mono text-slate-500 mb-1">SI REPITE EL CICLO #{h.number} ({h.daysToAth} días)</div>
                <div className="value-mono text-lg font-bold text-neon-gold mb-1">
                  {projectedDate.toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="text-[11px] text-slate-500">
                  {daysFromToday > 0 ? `Faltarían ${daysFromToday} días` : `Fue hace ${Math.abs(daysFromToday)} días`}
                </div>
              </div>
            );
          })}
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

      <Disclaimer text="El comportamiento pasado de los ciclos no garantiza resultados futuros — con solo 3 ciclos completos de referencia, la muestra estadística es muy chica. Esto es contexto histórico, no una predicción ni recomendación de inversión (NFA)." />
    </div>
  );
}
