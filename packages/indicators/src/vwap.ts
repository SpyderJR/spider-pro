export interface VwapInput {
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Anchored VWAP — cumulative volume-weighted average price from the start of the given candle set. */
export function vwap(candles: VwapInput[]): number[] {
  const out: number[] = new Array(candles.length).fill(0);
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  for (let i = 0; i < candles.length; i++) {
    const typicalPrice = (candles[i]!.high + candles[i]!.low + candles[i]!.close) / 3;
    cumulativePV += typicalPrice * candles[i]!.volume;
    cumulativeVolume += candles[i]!.volume;
    out[i] = cumulativeVolume === 0 ? typicalPrice : cumulativePV / cumulativeVolume;
  }

  return out;
}
