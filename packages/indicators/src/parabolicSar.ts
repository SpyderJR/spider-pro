export interface SarInput {
  high: number;
  low: number;
}

export interface SarPoint {
  value: number;
  isUptrend: boolean;
}

/** Parabolic SAR — trailing stop-and-reverse dots that flip side when price crosses them. */
export function parabolicSar(candles: SarInput[], step = 0.02, maxStep = 0.2): (SarPoint | null)[] {
  const n = candles.length;
  const out: (SarPoint | null)[] = new Array(n).fill(null);
  if (n < 2) return out;

  let isUptrend = candles[1]!.high > candles[0]!.high;
  let sar = isUptrend ? candles[0]!.low : candles[0]!.high;
  let extremePoint = isUptrend ? candles[0]!.high : candles[0]!.low;
  let af = step;

  out[0] = { value: sar, isUptrend };

  for (let i = 1; i < n; i++) {
    const prevSar = sar;
    sar = prevSar + af * (extremePoint - prevSar);

    const high = candles[i]!.high;
    const low = candles[i]!.low;

    if (isUptrend) {
      sar = Math.min(sar, candles[i - 1]!.low, i >= 2 ? candles[i - 2]!.low : candles[i - 1]!.low);
      if (low < sar) {
        isUptrend = false;
        sar = extremePoint;
        extremePoint = low;
        af = step;
      } else if (high > extremePoint) {
        extremePoint = high;
        af = Math.min(af + step, maxStep);
      }
    } else {
      sar = Math.max(sar, candles[i - 1]!.high, i >= 2 ? candles[i - 2]!.high : candles[i - 1]!.high);
      if (high > sar) {
        isUptrend = true;
        sar = extremePoint;
        extremePoint = high;
        af = step;
      } else if (low < extremePoint) {
        extremePoint = low;
        af = Math.min(af + step, maxStep);
      }
    }

    out[i] = { value: sar, isUptrend };
  }

  return out;
}
