import type { FuturesSide } from "./liquidation";

export type MarginMode = "isolated" | "cross";
export type FuturesExitReason = "manual" | "stop_loss" | "take_profit" | "liquidation";

export interface FuturesPosition {
  id: string;
  pair: string;
  side: FuturesSide;
  entryPrice: number;
  quantity: number;
  leverage: number;
  marginMode: MarginMode;
  margin: number;
  liquidationPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  openedAt: number;
  lastFundingAt: number;
  fundingPaid: number;
}

export interface FuturesPendingOrder {
  id: string;
  pair: string;
  side: FuturesSide;
  limitPrice: number;
  quantity: number;
  leverage: number;
  marginMode: MarginMode;
  stopLoss: number | null;
  takeProfit: number | null;
  createdAt: number;
}

export interface FuturesClosedTrade {
  id: string;
  pair: string;
  side: FuturesSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  leverage: number;
  marginMode: MarginMode;
  margin: number;
  liquidationPrice: number;
  pnl: number;
  pnlPercent: number;
  fundingPaid: number;
  openedAt: number;
  closedAt: number;
  exitReason: FuturesExitReason;
  stopLoss: number | null;
  takeProfit: number | null;
  feedback: string[];
}
