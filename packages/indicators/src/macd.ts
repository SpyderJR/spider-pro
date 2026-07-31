import { ema } from "./movingAverages.js";

export interface MacdPoint {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}

export function macd(
  values: number[],
  fast = 12,
  slow = 26,
  signalPeriod = 9,
): MacdPoint[] {
  const fastEma = ema(values, fast);
  const slowEma = ema(values, slow);

  const macdLine: (number | null)[] = values.map((_, i) => {
    const f = fastEma[i];
    const s = slowEma[i];
    return f !== null && f !== undefined && s !== null && s !== undefined ? f - s : null;
  });

  // Signal line is an EMA of the MACD line, computed only over the defined tail.
  const firstValid = macdLine.findIndex((v) => v !== null);
  const signalLine: (number | null)[] = new Array(values.length).fill(null);
  if (firstValid !== -1) {
    const tail = macdLine.slice(firstValid).map((v) => v as number);
    const tailSignal = ema(tail, signalPeriod);
    for (let i = 0; i < tailSignal.length; i++) {
      signalLine[firstValid + i] = tailSignal[i] ?? null;
    }
  }

  return values.map((_, i) => {
    const m = macdLine[i] ?? null;
    const s = signalLine[i] ?? null;
    return {
      macd: m,
      signal: s,
      histogram: m !== null && s !== null ? m - s : null,
    };
  });
}
