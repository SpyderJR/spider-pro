// Simplified, isolated-margin liquidation model for education purposes. Real exchanges
// tier the maintenance margin rate by position notional; we use one representative flat
// rate so the numbers are consistent and honestly labeled "aproximado" everywhere they
// appear, rather than mimicking one specific exchange's exact tiered formula.
export const APPROX_MAINTENANCE_MARGIN_RATE = 0.005; // 0.5%

export type FuturesSide = "long" | "short";

/** Fraction of the entry price that adverse movement can travel before liquidation. */
export function liquidationDistanceFraction(leverage: number, mmr = APPROX_MAINTENANCE_MARGIN_RATE): number {
  return Math.max(1 / leverage - mmr, 0.0005);
}

export function liquidationDistancePercent(leverage: number, mmr = APPROX_MAINTENANCE_MARGIN_RATE): number {
  return liquidationDistanceFraction(leverage, mmr) * 100;
}

export function computeLiquidationPrice(
  entryPrice: number,
  leverage: number,
  side: FuturesSide,
  mmr = APPROX_MAINTENANCE_MARGIN_RATE,
): number {
  const distance = liquidationDistanceFraction(leverage, mmr);
  return side === "long" ? entryPrice * (1 - distance) : entryPrice * (1 + distance);
}

/** Margin (collateral) required to open a position of a given notional size at a given leverage. */
export function computeRequiredMargin(notionalUsd: number, leverage: number): number {
  return leverage > 0 ? notionalUsd / leverage : notionalUsd;
}

export function isLiquidated(side: FuturesSide, price: number, liquidationPrice: number): boolean {
  return side === "long" ? price <= liquidationPrice : price >= liquidationPrice;
}

/** True when the stop loss would never fire because liquidation happens first. */
export function stopLossUnreachable(side: FuturesSide, stopLoss: number, liquidationPrice: number): boolean {
  return side === "long" ? liquidationPrice >= stopLoss : liquidationPrice <= stopLoss;
}
