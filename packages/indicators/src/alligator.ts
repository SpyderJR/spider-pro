export interface AlligatorInput {
  high: number;
  low: number;
}

export interface AlligatorPoint {
  jaw: number | null;
  teeth: number | null;
  lips: number | null;
}

/** Wilder-style smoothed moving average, seeded with a plain SMA over the first `period` values. */
function smma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period) return out;
  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i]!;
  let prev = sum / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = (prev * (period - 1) + values[i]!) / period;
    out[i] = prev;
  }
  return out;
}

/** Shifts a series `n` bars forward — the value plotted at index i is the one computed at (i - n). */
function shiftForward(values: (number | null)[], n: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    const srcIdx = i - n;
    out[i] = srcIdx >= 0 ? values[srcIdx]! : null;
  }
  return out;
}

/**
 * Bill Williams' Alligator — 3 forward-shifted smoothed moving averages of the median
 * price (high+low)/2: Jaw (13, shifted 8), Teeth (8, shifted 5), Lips (5, shifted 3).
 */
export function alligator(candles: AlligatorInput[]): AlligatorPoint[] {
  const median = candles.map((c) => (c.high + c.low) / 2);
  const jaw = shiftForward(smma(median, 13), 8);
  const teeth = shiftForward(smma(median, 8), 5);
  const lips = shiftForward(smma(median, 5), 3);
  return candles.map((_, i) => ({ jaw: jaw[i]!, teeth: teeth[i]!, lips: lips[i]! }));
}
