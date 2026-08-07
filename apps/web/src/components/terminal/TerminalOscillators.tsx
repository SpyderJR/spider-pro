import { IndicatorPaneChart } from "../charts/IndicatorPaneChart";
import type { BinanceCandle } from "../../lib/binance/types";
import type { TerminalIndicators, TerminalIndicatorToggles } from "../../hooks/useTerminalIndicators";

export function TerminalOscillators({
  candles,
  toggles,
  indicators,
}: {
  candles: BinanceCandle[];
  toggles: TerminalIndicatorToggles;
  indicators: TerminalIndicators;
}) {
  if (!toggles.rsi && !toggles.ao && !toggles.atr && !toggles.cmf) return null;

  return (
    <div className="space-y-3 mt-3">
      {toggles.rsi && indicators.rsiValues && (
        <div className="panel p-3">
          <div className="text-[10px] font-mono text-slate-500 mb-1.5">RSI (14)</div>
          <IndicatorPaneChart kind="line" candles={candles} values={indicators.rsiValues} color="#3ba8ff" refLines={[30, 70]} height={90} />
        </div>
      )}
      {toggles.ao && indicators.aoValues && (
        <div className="panel p-3">
          <div className="text-[10px] font-mono text-slate-500 mb-1.5">AWESOME OSCILLATOR</div>
          <AoHistogram candles={candles} values={indicators.aoValues} />
        </div>
      )}
      {toggles.atr && indicators.atrValues && (
        <div className="panel p-3">
          <div className="text-[10px] font-mono text-slate-500 mb-1.5">ATR (14) — VOLATILIDAD ABSOLUTA</div>
          <IndicatorPaneChart kind="line" candles={candles} values={indicators.atrValues} color="#ffcf4d" height={90} />
        </div>
      )}
      {toggles.cmf && indicators.cmfValues && (
        <div className="panel p-3">
          <div className="text-[10px] font-mono text-slate-500 mb-1.5">CHAIKIN MONEY FLOW (20)</div>
          <IndicatorPaneChart kind="line" candles={candles} values={indicators.cmfValues} color="#39ff9c" refLines={[0]} height={90} />
        </div>
      )}
    </div>
  );
}

function AoHistogram({ candles, values }: { candles: BinanceCandle[]; values: (number | null)[] }) {
  // Reuses the MACD histogram renderer with macd/signal left empty — it already
  // colors bars green/red by sign, which is exactly AO's classic look.
  return (
    <IndicatorPaneChart
      kind="histogram"
      candles={candles}
      macd={values.map((v) => ({ macd: null, signal: null, histogram: v }))}
      height={90}
    />
  );
}
