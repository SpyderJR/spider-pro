export interface HeikinAshiInput {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface HeikinAshiCandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Heikin Ashi — a smoothed alternate candle representation. Each HA close is the average of
 * the raw OHLC; each HA open is the midpoint of the *previous HA candle* (not the raw open),
 * which is what carries the smoothing effect forward bar-to-bar and makes trends look like
 * long runs of same-color candles instead of the raw series' noise.
 */
export function heikinAshi(candles: HeikinAshiInput[]): HeikinAshiCandle[] {
  const out: HeikinAshiCandle[] = [];
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i]!;
    const close = (c.open + c.high + c.low + c.close) / 4;
    const open = i === 0 ? (c.open + c.close) / 2 : (out[i - 1]!.open + out[i - 1]!.close) / 2;
    const high = Math.max(c.high, open, close);
    const low = Math.min(c.low, open, close);
    out.push({ open, high, low, close });
  }
  return out;
}
