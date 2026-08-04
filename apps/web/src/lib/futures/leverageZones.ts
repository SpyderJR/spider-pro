import { computeLiquidationPrice, type FuturesSide } from "./liquidation";

export interface LeverageZone {
  leverage: number;
  side: FuturesSide;
  estimatedLiquidationPrice: number;
  distancePercent: number;
}

export const DEFAULT_LEVERAGE_TIERS = [5, 10, 25, 50, 100];

/**
 * Applies the same liquidation-price formula already used by the Terminal and the
 * Liquidation Simulator to a set of common leverage tiers at the current price — an
 * estimate of where positions opened *right now* at these leverages would liquidate,
 * not real aggregated data from other traders' actual open positions (that data isn't
 * public anywhere for free).
 */
export function estimateLeverageZones(currentPrice: number, tiers: number[] = DEFAULT_LEVERAGE_TIERS): LeverageZone[] {
  const zones: LeverageZone[] = [];
  for (const leverage of tiers) {
    for (const side of ["long", "short"] as FuturesSide[]) {
      const estimatedLiquidationPrice = computeLiquidationPrice(currentPrice, leverage, side);
      const distancePercent = (Math.abs(estimatedLiquidationPrice - currentPrice) / currentPrice) * 100;
      zones.push({ leverage, side, estimatedLiquidationPrice, distancePercent });
    }
  }
  return zones;
}
