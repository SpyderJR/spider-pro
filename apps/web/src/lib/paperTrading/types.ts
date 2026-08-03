export type OrderSide = "buy" | "sell";
export type ExitReason = "manual" | "stop_loss" | "take_profit";

export interface Position {
  id: string;
  pair: string;
  side: OrderSide;
  entryPrice: number;
  quantity: number;
  stopLoss: number | null;
  takeProfit: number | null;
  openedAt: number;
}

export interface PendingOrder {
  id: string;
  pair: string;
  side: OrderSide;
  limitPrice: number;
  quantity: number;
  stopLoss: number | null;
  takeProfit: number | null;
  createdAt: number;
}

export interface ClosedTrade {
  id: string;
  pair: string;
  side: OrderSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  openedAt: number;
  closedAt: number;
  exitReason: ExitReason;
  stopLoss: number | null;
  takeProfit: number | null;
  feedback: string[];
}
