import type { FuturesSide } from "./liquidation";
import type { FuturesPendingOrder, FuturesPosition } from "./types";

export function computeFuturesPnl(side: FuturesSide, entryPrice: number, exitPrice: number, quantity: number): number {
  const diff = side === "long" ? exitPrice - entryPrice : entryPrice - exitPrice;
  return diff * quantity;
}

export function computeFuturesPnlPercent(side: FuturesSide, entryPrice: number, exitPrice: number, leverage: number): number {
  const diff = side === "long" ? exitPrice - entryPrice : entryPrice - exitPrice;
  return (diff / entryPrice) * 100 * leverage;
}

export function shouldFillFuturesLimitOrder(order: FuturesPendingOrder, price: number): boolean {
  return order.side === "long" ? price <= order.limitPrice : price >= order.limitPrice;
}

export function checkFuturesPositionExit(position: FuturesPosition, price: number): "stop_loss" | "take_profit" | null {
  if (position.side === "long") {
    if (position.stopLoss !== null && price <= position.stopLoss) return "stop_loss";
    if (position.takeProfit !== null && price >= position.takeProfit) return "take_profit";
  } else {
    if (position.stopLoss !== null && price >= position.stopLoss) return "stop_loss";
    if (position.takeProfit !== null && price <= position.takeProfit) return "take_profit";
  }
  return null;
}

/** Funding cost for one payment: positive = this position pays, negative = it receives. */
export function computeFundingPayment(position: FuturesPosition, fundingRate: number): number {
  const notional = position.entryPrice * position.quantity;
  return position.side === "long" ? notional * fundingRate : -notional * fundingRate;
}
