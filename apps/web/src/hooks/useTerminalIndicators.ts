import { useMemo } from "react";
import { ema, rsi, ao, alligator, vwap, type AlligatorPoint } from "@spider/indicators";
import { detectFractals, type FractalPoint } from "../lib/fractals";
import { classicPivots, type PivotLevels } from "../lib/pivotPoints";
import type { BinanceCandle } from "../lib/binance/types";

export interface TerminalIndicatorToggles {
  fractals: boolean;
  alligator: boolean;
  pivots: boolean;
  ema20: boolean;
  ema50: boolean;
  ema200: boolean;
  volume: boolean;
  rsi: boolean;
  ao: boolean;
  vwap: boolean;
  volumeProfile: boolean;
}

export const DEFAULT_TOGGLES: TerminalIndicatorToggles = {
  fractals: true,
  alligator: false,
  pivots: false,
  ema20: true,
  ema50: true,
  ema200: false,
  volume: true,
  rsi: true,
  ao: false,
  vwap: false,
  volumeProfile: false,
};

export interface TerminalIndicators {
  fractals: FractalPoint[];
  alligatorData: AlligatorPoint[] | null;
  pivots: PivotLevels | null;
  ema20: (number | null)[] | null;
  ema50: (number | null)[] | null;
  ema200: (number | null)[] | null;
  rsiValues: (number | null)[] | null;
  aoValues: (number | null)[] | null;
  vwapValues: number[] | null;
}

/**
 * Recomputes only when `candles` (finalized history) changes — never on every
 * live WS tick, so overlays don't redraw dozens of times a second on busy pairs.
 */
export function useTerminalIndicators(
  candles: BinanceCandle[],
  toggles: TerminalIndicatorToggles,
  dailyCandles: BinanceCandle[] | null,
): TerminalIndicators {
  return useMemo(() => {
    const closes = candles.map((c) => c.close);

    let pivots: PivotLevels | null = null;
    if (toggles.pivots && dailyCandles && dailyCandles.length >= 2) {
      const prev = dailyCandles[dailyCandles.length - 2]!;
      pivots = classicPivots(prev.high, prev.low, prev.close);
    }

    return {
      fractals: toggles.fractals && candles.length >= 5 ? detectFractals(candles, 2) : [],
      alligatorData: toggles.alligator ? alligator(candles) : null,
      pivots,
      ema20: toggles.ema20 ? ema(closes, 20) : null,
      ema50: toggles.ema50 ? ema(closes, 50) : null,
      ema200: toggles.ema200 ? ema(closes, 200) : null,
      rsiValues: toggles.rsi ? rsi(closes, 14) : null,
      aoValues: toggles.ao ? ao(candles) : null,
      vwapValues: toggles.vwap ? vwap(candles) : null,
    };
  }, [candles, toggles, dailyCandles]);
}
