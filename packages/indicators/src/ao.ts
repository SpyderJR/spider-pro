import { sma } from "./movingAverages.js";

export interface AoInput {
  high: number;
  low: number;
}

/** Awesome Oscillator (Bill Williams) — SMA(5) minus SMA(34) of the median price (high+low)/2. */
export function ao(candles: AoInput[]): (number | null)[] {
  const median = candles.map((c) => (c.high + c.low) / 2);
  const fast = sma(median, 5);
  const slow = sma(median, 34);
  return median.map((_, i) => (fast[i] !== null && slow[i] !== null ? fast[i]! - slow[i]! : null));
}
