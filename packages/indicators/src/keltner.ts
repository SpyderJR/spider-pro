import { ema } from "./movingAverages.js";
import { atr, type AtrCandle } from "./atr.js";

export interface KeltnerInput extends AtrCandle {}

export interface KeltnerBand {
  upper: number | null;
  middle: number | null;
  lower: number | null;
}

/**
 * Keltner Channel — an EMA midline plus/minus a multiple of ATR (volatility-based bands,
 * unlike Bollinger's standard-deviation bands). Reuses the package's own `atr()` so the two
 * indicators can never drift out of sync with each other.
 */
export function keltnerChannel(candles: KeltnerInput[], emaPeriod = 20, atrPeriod = 10, multiplier = 2): KeltnerBand[] {
  const closes = candles.map((c) => c.close);
  const middleLine = ema(closes, emaPeriod);
  const atrValues = atr(candles, atrPeriod);
  return candles.map((_, i) => {
    const mid = middleLine[i] ?? null;
    const range = atrValues[i] ?? null;
    if (mid === null || range === null) return { upper: null, middle: null, lower: null };
    return { upper: mid + range * multiplier, middle: mid, lower: mid - range * multiplier };
  });
}
