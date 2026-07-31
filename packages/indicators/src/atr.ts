export interface AtrCandle {
  high: number;
  low: number;
  close: number;
}

/** Wilder's Average True Range — standard volatility measure used for squeeze/expansion reads. */
export function atr(candles: AtrCandle[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(candles.length).fill(null);
  if (candles.length <= period) return out;

  const trueRanges: number[] = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1]!.close;
    return Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  });

  let avg = 0;
  for (let i = 1; i <= period; i++) avg += trueRanges[i]!;
  avg /= period;
  out[period] = avg;

  for (let i = period + 1; i < candles.length; i++) {
    avg = (avg * (period - 1) + trueRanges[i]!) / period;
    out[i] = avg;
  }

  return out;
}
