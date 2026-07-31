export interface OhlcInput {
  high: number;
  low: number;
  close: number;
}

export interface StochasticPoint {
  k: number | null;
  d: number | null;
}

/** Stochastic Oscillator — %K measures close position within the recent range, %D smooths %K. */
export function stochastic(candles: OhlcInput[], kPeriod = 14, dPeriod = 3, smooth = 3): StochasticPoint[] {
  const rawK: (number | null)[] = candles.map((_, i) => {
    if (i < kPeriod - 1) return null;
    const window = candles.slice(i - kPeriod + 1, i + 1);
    const highest = Math.max(...window.map((c) => c.high));
    const lowest = Math.min(...window.map((c) => c.low));
    if (highest === lowest) return 50;
    return ((candles[i]!.close - lowest) / (highest - lowest)) * 100;
  });

  const smoothedK = movingAverageOf(rawK, smooth);
  const d = movingAverageOf(smoothedK, dPeriod);

  return candles.map((_, i) => ({ k: smoothedK[i] ?? null, d: d[i] ?? null }));
}

function movingAverageOf(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) continue;
    const window = values.slice(i - period + 1, i + 1);
    if (window.some((v) => v === null)) continue;
    out[i] = (window as number[]).reduce((a, b) => a + b, 0) / period;
  }
  return out;
}
