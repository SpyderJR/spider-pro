import { atr } from "@spider/indicators";
import type { BacktestConfig, BacktestTrade, EquityPoint } from "@spider/types";
import type { BinanceCandle } from "../binance/types";
import { computeIndicatorSeries, evaluateConditions } from "./conditions";

const ATR_PERIOD = 14;

interface OpenPosition {
  side: "long" | "short";
  entryPrice: number;
  entryTime: number;
  stopLoss: number;
  takeProfit: number | null;
  quantity: number;
}

export interface BacktestRunResult {
  trades: BacktestTrade[];
  equityCurve: EquityPoint[];
}

function computeStopLossPrice(entryPrice: number, side: "long" | "short", stopLossPercent: number): number {
  return side === "long" ? entryPrice * (1 - stopLossPercent / 100) : entryPrice * (1 + stopLossPercent / 100);
}

/** ATR-based stop — same direction logic as the percent version, but the distance from entry
 * is `atrMultiplier` × the current ATR reading instead of a fixed percent, so it widens on
 * volatile candles and tightens on calm ones. */
function computeAtrStopLossPrice(entryPrice: number, side: "long" | "short", atrValue: number, atrMultiplier: number): number {
  const distance = atrValue * atrMultiplier;
  return side === "long" ? entryPrice - distance : entryPrice + distance;
}

function computeTakeProfitPrice(entryPrice: number, side: "long" | "short", takeProfitPercent: number | null): number | null {
  if (takeProfitPercent === null) return null;
  return side === "long" ? entryPrice * (1 + takeProfitPercent / 100) : entryPrice * (1 - takeProfitPercent / 100);
}

/** Sized so that a stop-loss hit costs exactly `riskPercent`% of balance at entry — the same
 * risk-first sizing philosophy already taught in Gestión de Riesgo, applied mechanically.
 * Takes the SL distance in price terms directly so it works identically whether that distance
 * came from a fixed percent or from an ATR multiple. */
function computeQuantityForRisk(balance: number, riskPercent: number, slDistanceUsd: number): number {
  const riskAmountUsd = balance * (riskPercent / 100);
  return slDistanceUsd > 0 ? riskAmountUsd / slDistanceUsd : 0;
}

function computePnl(side: "long" | "short", entryPrice: number, exitPrice: number, quantity: number): number {
  return side === "long" ? quantity * (exitPrice - entryPrice) : quantity * (entryPrice - exitPrice);
}

function computePnlPercent(side: "long" | "short", entryPrice: number, exitPrice: number): number {
  const diff = side === "long" ? exitPrice - entryPrice : entryPrice - exitPrice;
  return (diff / entryPrice) * 100;
}

/**
 * Headless adaptation of `replayStore.ts`'s `advanceOne` + `replay/engine.ts`'s exit
 * predicates — same fill/exit logic, but iterating a local candle array and accumulating
 * into plain variables instead of Zustand `set()`, so it can run inside a Web Worker without
 * any React/store dependency.
 */
export function runBacktestLoop(candles: BinanceCandle[], config: BacktestConfig): BacktestRunResult {
  const allConditions = [...config.entryConditions, ...(config.exitConditions ?? [])];
  const series = computeIndicatorSeries(candles, allConditions);
  const atrSeries = config.stopLossMode === "atr" ? atr(candles, ATR_PERIOD) : null;

  const trades: BacktestTrade[] = [];
  const equityCurve: EquityPoint[] = [];
  let balance = config.initialBalance;
  let position: OpenPosition | null = null;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i]!;

    if (position) {
      let exitPrice: number | null = null;
      let exitReason: BacktestTrade["exitReason"] | null = null;

      // SL/TP checked against this candle's range first — same conservative
      // stop-loss-wins-ties convention as replay/engine.ts's checkPositionExitInRange.
      if (position.side === "long") {
        if (candle.low <= position.stopLoss) {
          exitPrice = position.stopLoss;
          exitReason = "stop_loss";
        } else if (position.takeProfit !== null && candle.high >= position.takeProfit) {
          exitPrice = position.takeProfit;
          exitReason = "take_profit";
        }
      } else {
        if (candle.high >= position.stopLoss) {
          exitPrice = position.stopLoss;
          exitReason = "stop_loss";
        } else if (position.takeProfit !== null && candle.low <= position.takeProfit) {
          exitPrice = position.takeProfit;
          exitReason = "take_profit";
        }
      }

      if (exitPrice === null && config.exitConditions && config.exitConditions.length > 0 && evaluateConditions(config.exitConditions, series, i)) {
        exitPrice = candle.close;
        exitReason = "exit_signal";
      }

      if (exitPrice !== null && exitReason !== null) {
        const pnl = computePnl(position.side, position.entryPrice, exitPrice, position.quantity);
        balance += pnl;
        trades.push({
          entryTime: position.entryTime,
          exitTime: candle.time * 1000,
          entryPrice: position.entryPrice,
          exitPrice,
          side: position.side,
          pnl,
          pnlPercent: computePnlPercent(position.side, position.entryPrice, exitPrice),
          exitReason,
        });
        position = null;
      }
    }

    if (!position && evaluateConditions(config.entryConditions, series, i)) {
      const entryPrice = candle.close;
      const atrValue = atrSeries?.[i] ?? null;

      // In ATR mode, a bar without enough history for a 14-period ATR reading yet just isn't
      // tradeable — skip it rather than silently falling back to a percent-based stop, which
      // would misrepresent what the backtest actually simulated.
      if (config.stopLossMode === "atr" && (atrValue === null || config.atrMultiplier === null)) {
        equityCurve.push({ time: candle.time, value: balance });
        continue;
      }

      const stopLoss =
        config.stopLossMode === "atr"
          ? computeAtrStopLossPrice(entryPrice, config.direction, atrValue!, config.atrMultiplier!)
          : computeStopLossPrice(entryPrice, config.direction, config.stopLossPercent);

      position = {
        side: config.direction,
        entryPrice,
        entryTime: candle.time * 1000,
        stopLoss,
        takeProfit: computeTakeProfitPrice(entryPrice, config.direction, config.takeProfitPercent),
        quantity: computeQuantityForRisk(balance, config.riskPercent, Math.abs(entryPrice - stopLoss)),
      };
    }

    equityCurve.push({ time: candle.time, value: balance });
  }

  if (position && candles.length > 0) {
    const lastCandle = candles[candles.length - 1]!;
    const exitPrice = lastCandle.close;
    const pnl = computePnl(position.side, position.entryPrice, exitPrice, position.quantity);
    balance += pnl;
    trades.push({
      entryTime: position.entryTime,
      exitTime: lastCandle.time * 1000,
      entryPrice: position.entryPrice,
      exitPrice,
      side: position.side,
      pnl,
      pnlPercent: computePnlPercent(position.side, position.entryPrice, exitPrice),
      exitReason: "end_of_data",
    });
    equityCurve[equityCurve.length - 1] = { time: lastCandle.time, value: balance };
  }

  return { trades, equityCurve };
}
