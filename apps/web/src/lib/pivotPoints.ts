import type { Candle } from "@spider/types";

export interface PivotLevels {
  r3: number;
  r2: number;
  r1: number;
  pp: number;
  s1: number;
  s2: number;
  s3: number;
}

/** Classic (floor trader) pivot points, computed from the prior period's high/low/close. */
export function classicPivots(prevHigh: number, prevLow: number, prevClose: number): PivotLevels {
  const pp = (prevHigh + prevLow + prevClose) / 3;
  const range = prevHigh - prevLow;
  return {
    r3: pp + range * 2,
    r2: pp + range,
    r1: pp * 2 - prevLow,
    pp,
    s1: pp * 2 - prevHigh,
    s2: pp - range,
    s3: pp - range * 2,
  };
}

export interface SwingLevel {
  price: number;
  time: number;
  kind: "resistance" | "support";
}

/**
 * Detects recent swing highs/lows (local extrema over a symmetric window) to use as
 * dynamic support/resistance zones — cheap on the main thread since it only runs
 * once per candle-set fetch, not per render.
 */
export function detectSwingLevels(candles: Candle[], window = 4, maxLevels = 4): SwingLevel[] {
  const levels: SwingLevel[] = [];

  for (let i = window; i < candles.length - window; i++) {
    const slice = candles.slice(i - window, i + window + 1);
    const current = candles[i]!;
    const isHigh = slice.every((c) => c.high <= current.high);
    const isLow = slice.every((c) => c.low >= current.low);
    if (isHigh) levels.push({ price: current.high, time: current.time, kind: "resistance" });
    if (isLow) levels.push({ price: current.low, time: current.time, kind: "support" });
  }

  const resistances = levels
    .filter((l) => l.kind === "resistance")
    .sort((a, b) => b.time - a.time)
    .slice(0, maxLevels);
  const supports = levels
    .filter((l) => l.kind === "support")
    .sort((a, b) => b.time - a.time)
    .slice(0, maxLevels);

  return [...resistances, ...supports].sort((a, b) => b.price - a.price);
}
