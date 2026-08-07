import { atr, type AtrCandle } from "./atr.js";

export interface SuperTrendInput extends AtrCandle {}

export interface SuperTrendPoint {
  value: number | null;
  trend: "up" | "down" | null;
}

/**
 * SuperTrend — an ATR-banded trailing stop/trend line. Starts from a basic upper/lower band
 * (median price ± multiplier·ATR), then "locks in" each band so it only ever tightens toward
 * price in the direction of the current trend (never loosens), flipping trend when price
 * crosses to the other side — the standard formulation used by every charting platform.
 */
export function superTrend(candles: SuperTrendInput[], period = 10, multiplier = 3): SuperTrendPoint[] {
  const atrValues = atr(candles, period);
  const out: SuperTrendPoint[] = new Array(candles.length).fill(null).map(() => ({ value: null, trend: null }));

  let prevUpperBand: number | null = null;
  let prevLowerBand: number | null = null;
  let prevTrend: "up" | "down" = "up";
  let prevClose: number | null = null;

  for (let i = 0; i < candles.length; i++) {
    const range = atrValues[i] ?? null;
    if (range === null) continue;
    const c = candles[i]!;
    const median = (c.high + c.low) / 2;
    const basicUpper = median + multiplier * range;
    const basicLower = median - multiplier * range;

    const finalUpper: number =
      prevUpperBand === null || basicUpper < prevUpperBand || (prevClose !== null && prevClose > prevUpperBand)
        ? basicUpper
        : prevUpperBand;
    const finalLower: number =
      prevLowerBand === null || basicLower > prevLowerBand || (prevClose !== null && prevClose < prevLowerBand)
        ? basicLower
        : prevLowerBand;

    let trend: "up" | "down" = prevTrend;
    if (prevClose !== null) {
      if (prevTrend === "up" && c.close < finalLower) trend = "down";
      else if (prevTrend === "down" && c.close > finalUpper) trend = "up";
    }

    out[i] = { value: trend === "up" ? finalLower : finalUpper, trend };

    prevUpperBand = finalUpper;
    prevLowerBand = finalLower;
    prevTrend = trend;
    prevClose = c.close;
  }

  return out;
}
