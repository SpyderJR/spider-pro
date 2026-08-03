import type { OrderSide, PendingOrder, Position } from "./types";

export function computeQuantity(usdAmount: number, price: number): number {
  return price > 0 ? usdAmount / price : 0;
}

export function computePnl(side: OrderSide, entryPrice: number, exitPrice: number, quantity: number): number {
  const diff = side === "buy" ? exitPrice - entryPrice : entryPrice - exitPrice;
  return diff * quantity;
}

export function computePnlPercent(side: OrderSide, entryPrice: number, exitPrice: number): number {
  const diff = side === "buy" ? exitPrice - entryPrice : entryPrice - exitPrice;
  return (diff / entryPrice) * 100;
}

export function computeUnrealizedPnl(position: Position, currentPrice: number): number {
  return computePnl(position.side, position.entryPrice, currentPrice, position.quantity);
}

/** Whether a pending limit order should fill given a new market price tick. */
export function shouldFillLimitOrder(order: PendingOrder, price: number): boolean {
  return order.side === "buy" ? price <= order.limitPrice : price >= order.limitPrice;
}

/** Whether an open position's stop loss or take profit was crossed by a new price tick. */
export function checkPositionExit(position: Position, price: number): "stop_loss" | "take_profit" | null {
  if (position.side === "buy") {
    if (position.stopLoss !== null && price <= position.stopLoss) return "stop_loss";
    if (position.takeProfit !== null && price >= position.takeProfit) return "take_profit";
  } else {
    if (position.stopLoss !== null && price >= position.stopLoss) return "stop_loss";
    if (position.takeProfit !== null && price <= position.takeProfit) return "take_profit";
  }
  return null;
}

export function computeRiskAmount(
  entryPrice: number,
  stopLoss: number,
  quantity: number,
  side: OrderSide,
): number {
  const diff = side === "buy" ? entryPrice - stopLoss : stopLoss - entryPrice;
  return Math.max(diff, 0) * quantity;
}

export function computeRiskRewardRatio(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  side: OrderSide,
): number | null {
  const risk = side === "buy" ? entryPrice - stopLoss : stopLoss - entryPrice;
  const reward = side === "buy" ? takeProfit - entryPrice : entryPrice - takeProfit;
  if (risk <= 0 || reward <= 0) return null;
  return reward / risk;
}
