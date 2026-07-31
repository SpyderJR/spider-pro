export interface ObvInput {
  close: number;
  volume: number;
}

/** On-Balance Volume — running total that adds volume on up closes, subtracts on down closes. */
export function obv(candles: ObvInput[]): number[] {
  const out: number[] = new Array(candles.length).fill(0);
  for (let i = 1; i < candles.length; i++) {
    const prevObv = out[i - 1]!;
    if (candles[i]!.close > candles[i - 1]!.close) out[i] = prevObv + candles[i]!.volume;
    else if (candles[i]!.close < candles[i - 1]!.close) out[i] = prevObv - candles[i]!.volume;
    else out[i] = prevObv;
  }
  return out;
}
