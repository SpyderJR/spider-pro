export interface CmfInput {
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Chaikin Money Flow — sums a "money flow volume" (volume weighted by where the close landed
 * within the bar's range, from -1 at the low to +1 at the high) over `period` bars, normalized
 * by total volume. Oscillates roughly -1..1; sustained readings above/below 0 indicate net
 * buying/selling pressure, not just price direction.
 */
export function cmf(candles: CmfInput[], period = 20): (number | null)[] {
  const moneyFlowVolume = candles.map((c) => {
    const range = c.high - c.low;
    if (range === 0) return 0;
    const multiplier = ((c.close - c.low) - (c.high - c.close)) / range;
    return multiplier * c.volume;
  });

  const out: (number | null)[] = new Array(candles.length).fill(null);
  for (let i = period - 1; i < candles.length; i++) {
    let mfvSum = 0;
    let volSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      mfvSum += moneyFlowVolume[j]!;
      volSum += candles[j]!.volume;
    }
    out[i] = volSum > 0 ? mfvSum / volSum : 0;
  }
  return out;
}
