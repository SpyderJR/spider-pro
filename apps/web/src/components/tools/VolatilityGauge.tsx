import { useMemo, useState } from "react";
import type { Timeframe } from "@spider/types";
import { atr, bollinger } from "@spider/indicators";
import { useKlines } from "../../hooks/useMarketData";
import { formatUsd, pricePrecision } from "../../lib/format";
import type { SelectedToken } from "../../store/indicatorConfigStore";

const TIMEFRAMES: Timeframe[] = ["5m", "15m", "1h", "4h"];

function percentileRank(values: number[], value: number): number {
  const valid = values.filter((v): v is number => v !== null && !Number.isNaN(v));
  if (valid.length === 0) return 50;
  const below = valid.filter((v) => v <= value).length;
  return (below / valid.length) * 100;
}

export function VolatilityGauge({ token }: { token: SelectedToken }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("15m");
  const klines = useKlines(token.symbol, timeframe, 150, token.coingeckoId);

  const stats = useMemo(() => {
    const candles = klines.data?.candles;
    if (!candles || candles.length < 30) return null;

    const closes = candles.map((c) => c.close);
    const atrValues = atr(candles, 14);
    const bb = bollinger(closes, 20, 2);

    const bandwidths = bb.map((b) =>
      b.upper !== null && b.lower !== null && b.middle !== null && b.middle !== 0
        ? ((b.upper - b.lower) / b.middle) * 100
        : null,
    );
    const validBandwidths = bandwidths.filter((v): v is number => v !== null);
    const currentBandwidth = validBandwidths.at(-1) ?? null;
    const currentAtr = atrValues.filter((v) => v !== null).at(-1) as number | null;
    const lastPrice = closes.at(-1) ?? 0;

    const rank = currentBandwidth !== null ? percentileRank(validBandwidths, currentBandwidth) : 50;

    return {
      currentBandwidth,
      currentAtr,
      atrPercent: currentAtr !== null && lastPrice > 0 ? (currentAtr / lastPrice) * 100 : null,
      rank,
      lastPrice,
    };
  }, [klines.data]);

  const zone =
    stats === null
      ? null
      : stats.rank <= 25
        ? { label: "COMPRESIÓN", desc: "Volatilidad baja — históricamente precede rupturas fuertes.", cls: "text-neon-blue" }
        : stats.rank >= 75
          ? { label: "EXPANSIÓN ALTA", desc: "Volatilidad elevada — movimientos amplios, mayor riesgo por vela.", cls: "text-neon-red" }
          : { label: "NORMAL", desc: "Volatilidad dentro de su rango habitual reciente.", cls: "text-neon-gold" };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              timeframe === tf
                ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5"
                : "border-void-border text-slate-500 hover:border-slate-600"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {stats && zone && (
        <>
          <div className="panel p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`text-lg font-bold ${zone.cls}`}>{zone.label}</div>
              <div className="text-xs font-mono text-slate-500">percentil {stats.rank.toFixed(0)}</div>
            </div>
            <div className="relative h-3 rounded-full bg-gradient-to-r from-neon-blue via-neon-gold to-neon-red overflow-hidden mb-2">
              <div
                className="absolute top-0 h-full w-1 bg-white shadow-lg"
                style={{ left: `${Math.min(98, Math.max(2, stats.rank))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-3">
              <span>Compresión</span>
              <span>Normal</span>
              <span>Expansión</span>
            </div>
            <p className="text-sm text-slate-400">{zone.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="panel p-4">
              <div className="text-xs font-mono text-slate-500 mb-1.5">ATR (14) — rango promedio por vela</div>
              <div className="value-mono text-xl text-neon-blue font-semibold">
                {stats.currentAtr !== null ? formatUsd(stats.currentAtr, pricePrecision(stats.currentAtr)) : "—"}
              </div>
              <div className="text-xs text-slate-500 mt-1 value-mono">
                {stats.atrPercent !== null ? `${stats.atrPercent.toFixed(2)}% del precio` : ""}
              </div>
            </div>
            <div className="panel p-4">
              <div className="text-xs font-mono text-slate-500 mb-1.5">Ancho de Bandas de Bollinger</div>
              <div className="value-mono text-xl text-neon-gold font-semibold">
                {stats.currentBandwidth !== null ? `${stats.currentBandwidth.toFixed(2)}%` : "—"}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            El ATR es una referencia útil para calibrar la distancia de stop en entradas de {timeframe}: un
            stop más chico que el ATR reciente tiende a saltar por ruido normal del mercado.
          </p>
        </>
      )}
    </div>
  );
}
