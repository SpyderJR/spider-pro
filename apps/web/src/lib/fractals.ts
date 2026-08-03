export interface FractalCandle {
  high: number;
  low: number;
}

export interface FractalPoint {
  /** Index of the central (signal) candle within the input array. */
  index: number;
  /** Index of the candle at which this fractal becomes confirmed — 2 candles after the center. */
  confirmedAtIndex: number;
  price: number;
  type: "bullish" | "bearish";
}

/**
 * Bill Williams' 5-bar fractal: the central candle's low (bullish) or high (bearish)
 * is more extreme than the 2 candles on each side. `window` is candles-per-side
 * (2 = the classic 5-bar fractal). A fractal only "confirms" once the 2 candles to
 * its right exist — mirrors how it behaves live (it can't be known until 2 bars later).
 */
export function detectFractals(candles: FractalCandle[], window = 2): FractalPoint[] {
  const points: FractalPoint[] = [];

  for (let i = window; i < candles.length - window; i++) {
    const center = candles[i]!;
    const left = candles.slice(i - window, i);
    const right = candles.slice(i + 1, i + 1 + window);

    const isBullish = [...left, ...right].every((c) => c.low > center.low);
    const isBearish = [...left, ...right].every((c) => c.high < center.high);

    if (isBullish) {
      points.push({ index: i, confirmedAtIndex: i + window, price: center.low, type: "bullish" });
    } else if (isBearish) {
      points.push({ index: i, confirmedAtIndex: i + window, price: center.high, type: "bearish" });
    }
  }

  return points;
}
