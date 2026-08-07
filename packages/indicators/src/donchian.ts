export interface DonchianInput {
  high: number;
  low: number;
}

export interface DonchianBand {
  upper: number | null;
  lower: number | null;
  middle: number | null;
}

/** Donchian Channel — highest high / lowest low over the last `period` candles, plus their midpoint. */
export function donchianChannel(candles: DonchianInput[], period = 20): DonchianBand[] {
  const out: DonchianBand[] = new Array(candles.length).fill(null).map(() => ({ upper: null, lower: null, middle: null }));
  for (let i = period - 1; i < candles.length; i++) {
    const window = candles.slice(i - period + 1, i + 1);
    const upper = Math.max(...window.map((c) => c.high));
    const lower = Math.min(...window.map((c) => c.low));
    out[i] = { upper, lower, middle: (upper + lower) / 2 };
  }
  return out;
}
