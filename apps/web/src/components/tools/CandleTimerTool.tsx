import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Timeframe } from "@spider/types";
import { fetchKlines } from "../../lib/api";
import { useCandleCountdown } from "../../hooks/useCandleCountdown";
import { TIMEFRAME_SECONDS } from "../../lib/timeframeDuration";
import { formatUsd, formatPercent, pricePrecision } from "../../lib/format";
import type { SelectedToken } from "../../store/indicatorConfigStore";

const FAST_TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h"];

export function CandleTimerTool({ token }: { token: SelectedToken }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("5m");

  const klines = useQuery({
    queryKey: ["candle-timer", token.symbol, timeframe],
    queryFn: () => fetchKlines(token.symbol, timeframe, 10, token.coingeckoId),
    refetchInterval: 4_000,
  });

  const candles = klines.data?.candles ?? [];
  const forming = candles.at(-1);
  const previous = candles.at(-2);
  const secondsLeft = useCandleCountdown(forming?.time, timeframe);
  const duration = TIMEFRAME_SECONDS[timeframe];
  const progress = secondsLeft !== null ? 1 - secondsLeft / duration : 0;

  const formingChangePercent =
    forming && forming.open > 0 ? ((forming.close - forming.open) / forming.open) * 100 : null;
  const formingIsUp = formingChangePercent !== null && formingChangePercent >= 0;
  const prevIsUp = previous ? previous.close >= previous.open : null;

  const mm = secondsLeft !== null ? String(Math.floor(secondsLeft / 60)).padStart(2, "0") : "--";
  const ss = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, "0") : "--";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FAST_TIMEFRAMES.map((tf) => (
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

      <div className="grid md:grid-cols-[280px_1fr] gap-5">
        <div className="panel p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className={`pointer-events-none absolute inset-0 opacity-20 transition-colors ${
              formingIsUp ? "bg-neon-green" : "bg-neon-red"
            }`}
            style={{ clipPath: `inset(${100 - progress * 100}% 0 0 0)` }}
          />
          <div className="relative text-xs font-mono text-slate-500 mb-2 tracking-widest">
            CIERRE DE VELA EN
          </div>
          <div className="relative value-mono text-5xl font-bold text-white tabular-nums">
            {mm}:{ss}
          </div>
          <div className="relative w-full h-1.5 bg-void-soft rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${formingIsUp ? "bg-neon-green" : "bg-neon-red"}`}
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="panel p-4">
            <div className="text-xs font-mono text-slate-500 mb-2 tracking-widest">
              VELA EN FORMACIÓN ({timeframe})
            </div>
            {forming && (
              <>
                <div
                  className={`value-mono text-2xl font-bold ${formingIsUp ? "text-neon-green" : "text-neon-red"}`}
                >
                  {formatUsd(forming.close, pricePrecision(forming.close))}
                </div>
                <div className="text-xs text-slate-500 mt-1 value-mono">
                  {formingChangePercent !== null && formatPercent(formingChangePercent)} desde apertura
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] value-mono text-slate-400">
                  <div>Apertura: {formatUsd(forming.open, pricePrecision(forming.open))}</div>
                  <div>Máximo: {formatUsd(forming.high, pricePrecision(forming.high))}</div>
                  <div>Mínimo: {formatUsd(forming.low, pricePrecision(forming.low))}</div>
                  <div>Vol: {forming.volume.toFixed(1)}</div>
                </div>
              </>
            )}
          </div>

          <div className="panel p-4">
            <div className="text-xs font-mono text-slate-500 mb-2 tracking-widest">VELA ANTERIOR</div>
            {previous && (
              <>
                <div
                  className={`badge ${
                    prevIsUp
                      ? "text-neon-green border-neon-green/40 bg-neon-green/5"
                      : "text-neon-red border-neon-red/40 bg-neon-red/5"
                  }`}
                >
                  {prevIsUp ? "▲ ALCISTA" : "▼ BAJISTA"}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] value-mono text-slate-400">
                  <div>Cierre: {formatUsd(previous.close, pricePrecision(previous.close))}</div>
                  <div>
                    Rango: {formatUsd(previous.high - previous.low, pricePrecision(previous.high - previous.low))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Pensado para operativa de vela cerrada en marcos cortos: mirá el conteo antes de decidir una
        entrada, en vez de reaccionar a mitad de vela.
      </p>
    </div>
  );
}
