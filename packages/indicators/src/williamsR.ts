import type { OhlcInput } from "./stochastic.js";

/** Williams %R — inverted stochastic-style oscillator, scaled 0 (overbought) to -100 (oversold). */
export function williamsR(candles: OhlcInput[], period = 14): (number | null)[] {
  return candles.map((_, i) => {
    if (i < period - 1) return null;
    const window = candles.slice(i - period + 1, i + 1);
    const highest = Math.max(...window.map((c) => c.high));
    const lowest = Math.min(...window.map((c) => c.low));
    if (highest === lowest) return -50;
    return ((highest - candles[i]!.close) / (highest - lowest)) * -100;
  });
}
