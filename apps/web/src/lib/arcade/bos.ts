import type { FractalPoint } from "../fractals";

export interface BosCandle {
  high: number;
  low: number;
  close: number;
}

export interface BosPoint {
  /** Index of the candle whose close breaks the prior swing — the BOS confirmation candle. */
  index: number;
  type: "bullish" | "bearish";
}

/**
 * Simplified Break of Structure: a bullish BOS is a close above the most recent
 * confirmed bearish fractal (swing high); a bearish BOS is a close below the most
 * recent confirmed bullish fractal (swing low). Educational approximation of the
 * Smart Money Concepts idea already taught on the Fractales & Estructura page.
 */
export function detectBOS(candles: BosCandle[], fractals: FractalPoint[]): BosPoint[] {
  const points: BosPoint[] = [];
  let lastSwingHigh: number | null = null;
  let lastSwingLow: number | null = null;

  const fractalsByConfirmIndex = new Map<number, FractalPoint[]>();
  for (const f of fractals) {
    const list = fractalsByConfirmIndex.get(f.confirmedAtIndex) ?? [];
    list.push(f);
    fractalsByConfirmIndex.set(f.confirmedAtIndex, list);
  }

  for (let i = 0; i < candles.length; i++) {
    const justConfirmed = fractalsByConfirmIndex.get(i);
    if (justConfirmed) {
      for (const f of justConfirmed) {
        if (f.type === "bearish") lastSwingHigh = f.price;
        else lastSwingLow = f.price;
      }
    }

    const close = candles[i]!.close;

    if (lastSwingHigh !== null && close > lastSwingHigh) {
      points.push({ index: i, type: "bullish" });
      lastSwingHigh = null;
    } else if (lastSwingLow !== null && close < lastSwingLow) {
      points.push({ index: i, type: "bearish" });
      lastSwingLow = null;
    }
  }

  return points;
}
