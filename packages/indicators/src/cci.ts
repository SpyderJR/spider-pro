import type { OhlcInput } from "./stochastic.js";

/** Commodity Channel Index — measures deviation of typical price from its moving average. */
export function cci(candles: OhlcInput[], period = 20): (number | null)[] {
  const typicalPrices = candles.map((c) => (c.high + c.low + c.close) / 3);

  return candles.map((_, i) => {
    if (i < period - 1) return null;
    const window = typicalPrices.slice(i - period + 1, i + 1);
    const sma = window.reduce((a, b) => a + b, 0) / period;
    const meanDeviation = window.reduce((sum, tp) => sum + Math.abs(tp - sma), 0) / period;
    if (meanDeviation === 0) return 0;
    return (typicalPrices[i]! - sma) / (0.015 * meanDeviation);
  });
}
