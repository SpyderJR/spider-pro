import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BinanceCandle } from "../lib/binance/types";
import type { ClosedTrade, ExitReason, OrderSide, PendingOrder, Position } from "../lib/paperTrading/types";
import { computePnl, computePnlPercent, computeQuantity } from "../lib/paperTrading/engine";
import { checkPositionExitInRange, shouldFillLimitOrderInRange } from "../lib/replay/engine";
import type { ReplaySpeed } from "../lib/replay/periods";

const INITIAL_REPLAY_BALANCE = 10_000;

type ReplayStatus = "setup" | "active" | "finished";

interface ReplayState {
  status: ReplayStatus;
  periodId: string | null;
  periodLabel: string | null;
  symbol: string;
  interval: string;
  candles: BinanceCandle[];
  startIndex: number;
  currentIndex: number;
  isPlaying: boolean;
  speed: ReplaySpeed;

  balance: number;
  positions: Position[];
  orders: PendingOrder[];
  history: ClosedTrade[];

  startReplay: (params: {
    periodId: string;
    periodLabel: string;
    symbol: string;
    interval: string;
    candles: BinanceCandle[];
    startIndex: number;
  }) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: ReplaySpeed) => void;
  advanceOne: () => void;
  openMarketPosition: (params: {
    side: OrderSide;
    usdAmount: number;
    quantity: number;
    price: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
  placeLimitOrder: (params: {
    side: OrderSide;
    quantity: number;
    limitPrice: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
  cancelOrder: (id: string) => void;
  updatePositionSlTp: (id: string, stopLoss: number | null, takeProfit: number | null) => void;
  closePositionManually: (id: string) => void;
  finishReplay: () => void;
  resetToSetup: () => void;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function closeInternal(
  s: ReplayState,
  positionId: string,
  exitPrice: number,
  reason: ExitReason,
  closedAt: number,
): Partial<ReplayState> | null {
  const position = s.positions.find((p) => p.id === positionId);
  if (!position) return null;

  const pnl = computePnl(position.side, position.entryPrice, exitPrice, position.quantity);
  const pnlPercent = computePnlPercent(position.side, position.entryPrice, exitPrice);
  const trade: ClosedTrade = {
    id: position.id,
    pair: s.symbol,
    side: position.side,
    entryPrice: position.entryPrice,
    exitPrice,
    quantity: position.quantity,
    pnl,
    pnlPercent,
    openedAt: position.openedAt,
    closedAt,
    exitReason: reason,
    stopLoss: position.stopLoss,
    takeProfit: position.takeProfit,
    feedback: [],
  };

  return {
    positions: s.positions.filter((p) => p.id !== positionId),
    history: [trade, ...s.history],
    balance: s.balance + pnl,
  };
}

export const useReplayStore = create<ReplayState>()(
  persist(
    (set, get) => ({
      status: "setup",
      periodId: null,
      periodLabel: null,
      symbol: "BTCUSDT",
      interval: "1h",
      candles: [],
      startIndex: 0,
      currentIndex: 0,
      isPlaying: false,
      speed: 1,

      balance: INITIAL_REPLAY_BALANCE,
      positions: [],
      orders: [],
      history: [],

      startReplay: ({ periodId, periodLabel, symbol, interval, candles, startIndex }) => {
        set({
          status: "active",
          periodId,
          periodLabel,
          symbol,
          interval,
          candles,
          startIndex,
          currentIndex: startIndex,
          isPlaying: false,
          speed: 1,
          balance: INITIAL_REPLAY_BALANCE,
          positions: [],
          orders: [],
          history: [],
        });
      },

      setPlaying: (playing) => set({ isPlaying: playing }),
      setSpeed: (speed) => set({ speed }),

      advanceOne: () => {
        const s = get();
        if (s.status !== "active") return;
        const nextIndex = s.currentIndex + 1;
        if (nextIndex >= s.candles.length) {
          set({ isPlaying: false });
          get().finishReplay();
          return;
        }
        const candle = s.candles[nextIndex]!;

        let positions = s.positions;
        let orders = s.orders;
        let history = s.history;
        let balance = s.balance;

        const stillOpenOrders: PendingOrder[] = [];
        for (const order of orders) {
          if (shouldFillLimitOrderInRange(order, candle.low, candle.high)) {
            const position: Position = {
              id: order.id,
              pair: s.symbol,
              side: order.side,
              entryPrice: order.limitPrice,
              quantity: order.quantity,
              stopLoss: order.stopLoss,
              takeProfit: order.takeProfit,
              openedAt: candle.time * 1000,
            };
            positions = [...positions, position];
          } else {
            stillOpenOrders.push(order);
          }
        }
        orders = stillOpenOrders;

        for (const position of positions) {
          const exit = checkPositionExitInRange(position, candle.low, candle.high);
          if (exit) {
            const exitPrice = exit === "stop_loss" ? position.stopLoss! : position.takeProfit!;
            const result = closeInternal(
              { ...s, positions, orders, history, balance },
              position.id,
              exitPrice,
              exit,
              candle.time * 1000,
            );
            if (result) {
              positions = result.positions!;
              history = result.history!;
              balance = result.balance!;
            }
          }
        }

        set({ currentIndex: nextIndex, positions, orders, history, balance });
      },

      openMarketPosition: ({ side, quantity, price, stopLoss, takeProfit }) => {
        const s = get();
        const position: Position = {
          id: makeId(),
          pair: s.symbol,
          side,
          entryPrice: price,
          quantity,
          stopLoss,
          takeProfit,
          openedAt: s.candles[s.currentIndex]!.time * 1000,
        };
        set({ positions: [...s.positions, position] });
      },

      placeLimitOrder: ({ side, quantity, limitPrice, stopLoss, takeProfit }) => {
        const s = get();
        const order: PendingOrder = {
          id: makeId(),
          pair: s.symbol,
          side,
          limitPrice,
          quantity,
          stopLoss,
          takeProfit,
          createdAt: s.candles[s.currentIndex]!.time * 1000,
        };
        set({ orders: [...s.orders, order] });
      },

      cancelOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      updatePositionSlTp: (id, stopLoss, takeProfit) =>
        set((s) => ({ positions: s.positions.map((p) => (p.id === id ? { ...p, stopLoss, takeProfit } : p)) })),

      closePositionManually: (id) => {
        const s = get();
        const currentCandle = s.candles[s.currentIndex];
        if (!currentCandle) return;
        const result = closeInternal(s, id, currentCandle.close, "manual", currentCandle.time * 1000);
        if (result) set(result);
      },

      finishReplay: () => {
        const s = get();
        const currentCandle = s.candles[s.currentIndex];
        let positions = s.positions;
        let history = s.history;
        let balance = s.balance;

        if (currentCandle) {
          for (const position of s.positions) {
            const result = closeInternal({ ...s, positions, history, balance }, position.id, currentCandle.close, "manual", currentCandle.time * 1000);
            if (result) {
              positions = result.positions!;
              history = result.history!;
              balance = result.balance!;
            }
          }
        }

        set({ status: "finished", isPlaying: false, positions, history, balance });
      },

      resetToSetup: () =>
        set({
          status: "setup",
          periodId: null,
          periodLabel: null,
          candles: [],
          startIndex: 0,
          currentIndex: 0,
          isPlaying: false,
          balance: INITIAL_REPLAY_BALANCE,
          positions: [],
          orders: [],
          history: [],
        }),
    }),
    { name: "spider-replay-trading" },
  ),
);

export { INITIAL_REPLAY_BALANCE };
