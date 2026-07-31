import { useMemo, useState } from "react";
import type { Timeframe } from "@spider/types";
import { useKlines } from "../../hooks/useMarketData";
import { classicPivots, detectSwingLevels, type PivotLevels } from "../../lib/pivotPoints";
import { formatUsd, formatPercent, pricePrecision } from "../../lib/format";
import type { SelectedToken } from "../../store/indicatorConfigStore";

const TIMEFRAMES: Timeframe[] = ["5m", "15m", "1h"];

export function KeyLevelsTool({ token }: { token: SelectedToken }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("15m");
  const intraday = useKlines(token.symbol, timeframe, 150, token.coingeckoId);
  const daily = useKlines(token.symbol, "1d", 10, token.coingeckoId);

  const pivots: PivotLevels | null = useMemo(() => {
    const days = daily.data?.candles;
    if (!days || days.length < 2) return null;
    const prev = days.at(-2)!;
    return classicPivots(prev.high, prev.low, prev.close);
  }, [daily.data]);

  const swings = useMemo(() => {
    if (!intraday.data) return [];
    return detectSwingLevels(intraday.data.candles, 4, 4);
  }, [intraday.data]);

  const lastPrice = intraday.data?.candles.at(-1)?.close ?? null;
  const decimals = lastPrice !== null ? pricePrecision(lastPrice) : 2;

  const pivotRows = pivots
    ? ([
        ["R3", pivots.r3],
        ["R2", pivots.r2],
        ["R1", pivots.r1],
        ["PP", pivots.pp],
        ["S1", pivots.s1],
        ["S2", pivots.s2],
        ["S3", pivots.s3],
      ] as const)
    : [];

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
        <span className="text-[11px] text-slate-600 ml-1">— ventana usada para detectar soportes/resistencias dinámicos</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="panel p-5">
          <div className="text-xs font-mono text-slate-500 mb-3 tracking-widest">
            PIVOT POINTS CLÁSICOS (diario anterior)
          </div>
          {pivots ? (
            <div className="space-y-1.5">
              {pivotRows.map(([label, value]) => {
                const distance = lastPrice !== null ? ((value - lastPrice) / lastPrice) * 100 : null;
                const isNearest =
                  lastPrice !== null && Math.abs(value - lastPrice) === Math.min(...pivotRows.map(([, v]) => Math.abs(v - lastPrice)));
                return (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isNearest ? "bg-neon-gold/10 border border-neon-gold/30" : "bg-void-soft"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs w-8 ${
                        label === "PP" ? "text-neon-gold" : label.startsWith("R") ? "text-neon-red" : "text-neon-green"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="value-mono text-sm text-slate-200">{formatUsd(value, decimals)}</span>
                    <span className="value-mono text-xs text-slate-500 w-16 text-right">
                      {distance !== null ? formatPercent(distance) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-600 text-sm">Cargando…</div>
          )}
        </div>

        <div className="panel p-5">
          <div className="text-xs font-mono text-slate-500 mb-3 tracking-widest">
            SOPORTES/RESISTENCIAS DINÁMICOS ({timeframe})
          </div>
          {swings.length > 0 ? (
            <div className="space-y-1.5">
              {swings.map((s, i) => {
                const distance = lastPrice !== null ? ((s.price - lastPrice) / lastPrice) * 100 : null;
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-void-soft">
                    <span
                      className={`badge text-[10px] ${
                        s.kind === "resistance"
                          ? "text-neon-red border-neon-red/30"
                          : "text-neon-green border-neon-green/30"
                      }`}
                    >
                      {s.kind === "resistance" ? "RESIST." : "SOPORTE"}
                    </span>
                    <span className="value-mono text-sm text-slate-200">{formatUsd(s.price, decimals)}</span>
                    <span className="value-mono text-xs text-slate-500 w-16 text-right">
                      {distance !== null ? formatPercent(distance) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-600 text-sm">Cargando…</div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Los pivots clásicos se derivan del rango del día anterior; los niveles dinámicos son máximos y
        mínimos locales recientes detectados en la temporalidad elegida. Ambos son zonas de interés, no
        garantías de reacción del precio.
      </p>
    </div>
  );
}
