import { sma } from "./movingAverages.js";

export interface BollingerPoint {
  upper: number | null;
  middle: number | null;
  lower: number | null;
}

export function bollinger(values: number[], period = 20, stdDev = 2): BollingerPoint[] {
  const middleLine = sma(values, period);

  return values.map((_, i) => {
    const middle = middleLine[i];
    if (middle === null || middle === undefined || i < period - 1) {
      return { upper: null, middle: null, lower: null };
    }
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      variance += (values[j]! - middle) ** 2;
    }
    const sd = Math.sqrt(variance / period);
    return {
      upper: middle + stdDev * sd,
      middle,
      lower: middle - stdDev * sd,
    };
  });
}
