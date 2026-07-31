import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import type { Timeframe } from "@spider/types";
import { rsi, macd, atr, compositeSignal } from "@spider/indicators";
import { fetchKlines } from "../../lib/api";
import { formatPercent, formatUsd } from "../../lib/format";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h"];
const ASSETS = ["BTC", "TRX"] as const;

function computeMetrics(candles: { open: number; high: number; low: number; close: number }[]) {
  if (candles.length < 30) return null;
  const closes = candles.map((c) => c.close);
  const rsiValues = rsi(closes, 14);
  const macdValues = macd(closes, 12, 26, 9);
  const atrValues = atr(candles, 14);
  const lastPrice = closes.at(-1)!;
  const firstPrice = closes[Math.max(0, closes.length - 15)]!;
  const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
  const lastRsi = rsiValues.at(-1) ?? null;
  const lastMacdHist = macdValues.at(-1)?.histogram ?? null;
  const lastAtr = atrValues.filter((v) => v !== null).at(-1) as number | null;

  const signal = compositeSignal({
    rsi: lastRsi,
    macdHistogram: lastMacdHist,
    price: lastPrice,
    bollingerUpper: null,
    bollingerLower: null,
  });

  return {
    price: lastPrice,
    changePercent,
    rsi: lastRsi,
    macdHist: lastMacdHist,
    atrPercent: lastAtr !== null && lastPrice > 0 ? (lastAtr / lastPrice) * 100 : null,
    signal,
  };
}

export function MomentumRadarTool() {
  const [timeframe, setTimeframe] = useState<Timeframe>("5m");

  const queries = useQueries({
    queries: ASSETS.map((asset) => ({
      queryKey: ["momentum-radar", asset, timeframe],
      queryFn: () => fetchKlines(asset, timeframe, 120),
      refetchInterval: 15_000,
    })),
  });

  const metrics = useMemo(
    () => ASSETS.map((asset, i) => ({ asset, m: queries[i]?.data ? computeMetrics(queries[i]!.data!.candles) : null })),
    [queries],
  );

  const [btc, trx] = metrics;
  const strongerAsset =
    btc?.m && trx?.m
      ? Math.abs(btc.m.changePercent) === Math.abs(trx.m.changePercent)
        ? null
        : Math.abs(btc.m.changePercent) > Math.abs(trx.m.changePercent)
          ? "BTC"
          : "TRX"
      : null;

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

      {strongerAsset && (
        <div className="panel border border-neon-blue/30 bg-neon-blue/5 p-4 mb-4">
          <div className="text-xs font-mono text-slate-500 mb-1">MAYOR MOMENTUM RELATIVO ({timeframe})</div>
          <div className="text-lg font-bold text-neon-blue">{strongerAsset}</div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {metrics.map(({ asset, m }) => (
          <div key={asset} className="panel p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono font-bold text-white">{asset}</span>
              {m && (
                <span className={`badge ${m.signal === "bullish" ? "text-neon-green border-neon-green/30" : m.signal === "bearish" ? "text-neon-red border-neon-red/30" : "text-neon-gold border-neon-gold/30"}`}>
                  {m.signal === "bullish" ? "ALCISTA" : m.signal === "bearish" ? "BAJISTA" : "NEUTRAL"}
                </span>
              )}
            </div>
            {m ? (
              <div className="space-y-2.5">
                <Row label="Precio" value={formatUsd(m.price, m.price < 10 ? 5 : 2)} />
                <Row
                  label="Cambio (15 velas)"
                  value={formatPercent(m.changePercent)}
                  cls={m.changePercent >= 0 ? "text-neon-green" : "text-neon-red"}
                />
                <Row
                  label="RSI"
                  value={m.rsi !== null ? m.rsi.toFixed(1) : "—"}
                  cls={m.rsi !== null && m.rsi > 70 ? "text-neon-red" : m.rsi !== null && m.rsi < 30 ? "text-neon-green" : undefined}
                />
                <Row
                  label="MACD hist."
                  value={m.macdHist !== null ? m.macdHist.toFixed(m.macdHist < 1 ? 5 : 2) : "—"}
                  cls={m.macdHist !== null ? (m.macdHist >= 0 ? "text-neon-green" : "text-neon-red") : undefined}
                />
                <Row label="Volatilidad (ATR%)" value={m.atrPercent !== null ? `${m.atrPercent.toFixed(2)}%` : "—"} />
              </div>
            ) : (
              <div className="text-slate-600 text-sm">Cargando…</div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Comparación de corto plazo entre BTC y TRX en la misma temporalidad — útil para decidir a cuál de
        los dos prestarle atención en la próxima vela, no una señal de entrada por sí sola.
      </p>
    </div>
  );
}

function Row({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`value-mono ${cls ?? "text-slate-200"}`}>{value}</span>
    </div>
  );
}
