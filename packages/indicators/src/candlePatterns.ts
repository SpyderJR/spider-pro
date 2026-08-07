export interface CandlePatternInput {
  open: number;
  high: number;
  low: number;
  close: number;
}

export type CandlePatternType = "bullish_engulfing" | "bearish_engulfing" | "hammer" | "shooting_star" | "doji";

export interface CandlePatternMatch {
  index: number;
  type: CandlePatternType;
}

function bodySize(c: CandlePatternInput): number {
  return Math.abs(c.close - c.open);
}

function isBullish(c: CandlePatternInput): boolean {
  return c.close > c.open;
}

/**
 * A small, mechanically well-defined set of classic single/two-candle patterns — direct
 * geometric checks on OHLC (body vs. range, wick length vs. body), not a fuzzy scoring system.
 * Deliberately limited to the most-cited patterns rather than an exhaustive library, so each one
 * stays explainable in one sentence.
 */
export function detectCandlePatterns(candles: CandlePatternInput[]): CandlePatternMatch[] {
  const matches: CandlePatternMatch[] = [];

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i]!;
    const range = c.high - c.low;
    if (range === 0) continue;
    const body = bodySize(c);
    const upperWick = c.high - Math.max(c.open, c.close);
    const lowerWick = Math.min(c.open, c.close) - c.low;

    // Doji — the body is a tiny sliver of the candle's total range, signaling indecision.
    if (body / range < 0.1) {
      matches.push({ index: i, type: "doji" });
    }

    // Hammer — small body near the top of the range, a lower wick at least 2x the body, almost
    // no upper wick. Bullish reversal reading when it appears after a downtrend.
    if (body / range < 0.35 && lowerWick >= body * 2 && upperWick <= body * 0.5) {
      matches.push({ index: i, type: "hammer" });
    }

    // Shooting star — the mirror of a hammer: small body near the bottom, long upper wick.
    // Bearish reversal reading after an uptrend.
    if (body / range < 0.35 && upperWick >= body * 2 && lowerWick <= body * 0.5) {
      matches.push({ index: i, type: "shooting_star" });
    }

    if (i === 0) continue;
    const prev = candles[i - 1]!;
    if (bodySize(prev) === 0) continue;

    // Bullish engulfing — a green body that fully covers the prior red body.
    if (isBullish(c) && !isBullish(prev) && c.open <= prev.close && c.close >= prev.open) {
      matches.push({ index: i, type: "bullish_engulfing" });
    }

    // Bearish engulfing — a red body that fully covers the prior green body.
    if (!isBullish(c) && isBullish(prev) && c.open >= prev.close && c.close <= prev.open) {
      matches.push({ index: i, type: "bearish_engulfing" });
    }
  }

  return matches;
}
