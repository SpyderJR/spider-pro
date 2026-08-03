import type { PendingOrder, Position } from "../paperTrading/types";

/** Whether a pending limit order should fill given the range of a newly revealed candle. */
export function shouldFillLimitOrderInRange(order: PendingOrder, low: number, high: number): boolean {
  return order.side === "buy" ? low <= order.limitPrice : high >= order.limitPrice;
}

/**
 * Whether an open position's SL/TP was crossed within a newly revealed candle's range.
 * If both would have been crossed within the same candle, conservatively assumes the
 * stop loss hit first — we can't know intrabar order from OHLC data alone, and assuming
 * the worse outcome keeps the simulation honest rather than optimistic.
 */
export function checkPositionExitInRange(position: Position, low: number, high: number): "stop_loss" | "take_profit" | null {
  if (position.side === "buy") {
    if (position.stopLoss !== null && low <= position.stopLoss) return "stop_loss";
    if (position.takeProfit !== null && high >= position.takeProfit) return "take_profit";
  } else {
    if (position.stopLoss !== null && high >= position.stopLoss) return "stop_loss";
    if (position.takeProfit !== null && low <= position.takeProfit) return "take_profit";
  }
  return null;
}
