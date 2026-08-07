import { useMemo } from "react";
import {
  ema,
  rsi,
  ao,
  atr,
  alligator,
  vwap,
  heikinAshi,
  fibonacciRetracement,
  donchianChannel,
  keltnerChannel,
  cmf,
  superTrend,
  ichimoku,
  detectCandlePatterns,
  type AlligatorPoint,
  type HeikinAshiCandle,
  type FibonacciLevel,
  type DonchianBand,
  type KeltnerBand,
  type SuperTrendPoint,
  type IchimokuPoint,
  type CandlePatternMatch,
} from "@spider/indicators";
import { detectFractals, type FractalPoint } from "../lib/fractals";
import { classicPivots, type PivotLevels } from "../lib/pivotPoints";
import type { BinanceCandle } from "../lib/binance/types";

export interface TerminalIndicatorToggles {
  fractals: boolean;
  alligator: boolean;
  pivots: boolean;
  pivotsWeekly: boolean;
  ema20: boolean;
  ema50: boolean;
  ema200: boolean;
  volume: boolean;
  rsi: boolean;
  ao: boolean;
  atr: boolean;
  cmf: boolean;
  vwap: boolean;
  volumeProfile: boolean;
  heikinAshi: boolean;
  fibonacci: boolean;
  donchian: boolean;
  keltner: boolean;
  superTrend: boolean;
  ichimoku: boolean;
  candlePatterns: boolean;
}

export const DEFAULT_TOGGLES: TerminalIndicatorToggles = {
  fractals: true,
  alligator: false,
  pivots: false,
  pivotsWeekly: false,
  ema20: true,
  ema50: true,
  ema200: false,
  volume: true,
  rsi: true,
  ao: false,
  atr: false,
  cmf: false,
  vwap: false,
  volumeProfile: false,
  heikinAshi: false,
  fibonacci: false,
  donchian: false,
  keltner: false,
  superTrend: false,
  ichimoku: false,
  candlePatterns: false,
};

export interface TerminalIndicators {
  fractals: FractalPoint[];
  alligatorData: AlligatorPoint[] | null;
  pivots: PivotLevels | null;
  pivotsWeekly: PivotLevels | null;
  ema20: (number | null)[] | null;
  ema50: (number | null)[] | null;
  ema200: (number | null)[] | null;
  rsiValues: (number | null)[] | null;
  aoValues: (number | null)[] | null;
  atrValues: (number | null)[] | null;
  cmfValues: (number | null)[] | null;
  vwapValues: number[] | null;
  heikinAshiCandles: HeikinAshiCandle[] | null;
  fibonacciLevels: FibonacciLevel[] | null;
  donchianBands: DonchianBand[] | null;
  keltnerBands: KeltnerBand[] | null;
  superTrendPoints: SuperTrendPoint[] | null;
  ichimokuPoints: IchimokuPoint[] | null;
  candlePatternMatches: CandlePatternMatch[];
}

/**
 * Recomputes only when `candles` (finalized history) changes — never on every
 * live WS tick, so overlays don't redraw dozens of times a second on busy pairs.
 */
export function useTerminalIndicators(
  candles: BinanceCandle[],
  toggles: TerminalIndicatorToggles,
  dailyCandles: BinanceCandle[] | null,
  weeklyCandles: BinanceCandle[] | null = null,
): TerminalIndicators {
  return useMemo(() => {
    const closes = candles.map((c) => c.close);

    let pivots: PivotLevels | null = null;
    if (toggles.pivots && dailyCandles && dailyCandles.length >= 2) {
      const prev = dailyCandles[dailyCandles.length - 2]!;
      pivots = classicPivots(prev.high, prev.low, prev.close);
    }

    let pivotsWeekly: PivotLevels | null = null;
    if (toggles.pivotsWeekly && weeklyCandles && weeklyCandles.length >= 2) {
      const prev = weeklyCandles[weeklyCandles.length - 2]!;
      pivotsWeekly = classicPivots(prev.high, prev.low, prev.close);
    }

    // The most recent swing high/low across the loaded window is the reference range for
    // retracement levels — capped to the last 100 candles so an old, irrelevant extreme from
    // months ago doesn't dominate the levels shown on an intraday chart.
    let fibonacciLevels: FibonacciLevel[] | null = null;
    if (toggles.fibonacci && candles.length >= 10) {
      const window = candles.slice(-100);
      let highIdx = 0;
      let lowIdx = 0;
      window.forEach((c, i) => {
        if (c.high > window[highIdx]!.high) highIdx = i;
        if (c.low < window[lowIdx]!.low) lowIdx = i;
      });
      const direction = highIdx > lowIdx ? "up" : "down";
      fibonacciLevels = fibonacciRetracement(window[highIdx]!.high, window[lowIdx]!.low, direction);
    }

    return {
      fractals: toggles.fractals && candles.length >= 5 ? detectFractals(candles, 2) : [],
      alligatorData: toggles.alligator ? alligator(candles) : null,
      pivots,
      pivotsWeekly,
      ema20: toggles.ema20 ? ema(closes, 20) : null,
      ema50: toggles.ema50 ? ema(closes, 50) : null,
      ema200: toggles.ema200 ? ema(closes, 200) : null,
      rsiValues: toggles.rsi ? rsi(closes, 14) : null,
      aoValues: toggles.ao ? ao(candles) : null,
      atrValues: toggles.atr ? atr(candles, 14) : null,
      cmfValues: toggles.cmf ? cmf(candles, 20) : null,
      vwapValues: toggles.vwap ? vwap(candles) : null,
      heikinAshiCandles: toggles.heikinAshi ? heikinAshi(candles) : null,
      fibonacciLevels,
      donchianBands: toggles.donchian ? donchianChannel(candles, 20) : null,
      keltnerBands: toggles.keltner ? keltnerChannel(candles, 20, 10, 2) : null,
      superTrendPoints: toggles.superTrend ? superTrend(candles, 10, 3) : null,
      ichimokuPoints: toggles.ichimoku ? ichimoku(candles) : null,
      candlePatternMatches: toggles.candlePatterns ? detectCandlePatterns(candles) : [],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, toggles, dailyCandles, weeklyCandles]);
}
