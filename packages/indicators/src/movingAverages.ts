/**
 * All indicator functions return arrays aligned 1:1 with the input array,
 * using `null` for indices where there isn't yet enough data — callers zip
 * these against candle timestamps without needing to track offsets.
 */
export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i]!;
    if (i >= period) sum -= values[i - period]!;
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (values.length === 0) return out;
  const k = 2 / (period + 1);

  // Seed with an SMA over the first `period` values.
  let seed = 0;
  for (let i = 0; i < Math.min(period, values.length); i++) seed += values[i]!;
  if (values.length < period) return out;
  seed /= period;
  out[period - 1] = seed;

  let prev = seed;
  for (let i = period; i < values.length; i++) {
    prev = values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}
