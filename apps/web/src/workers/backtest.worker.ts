import * as Comlink from "comlink";
import type { BacktestConfig, BacktestResult } from "@spider/types";
import type { BinanceCandle } from "../lib/binance/types";
import { runBacktestLoop } from "../lib/backtest/engine";
import { computeMetrics } from "../lib/backtest/metrics";

function runBacktest(candles: BinanceCandle[], config: BacktestConfig): BacktestResult {
  const { trades, equityCurve } = runBacktestLoop(candles, config);
  const metrics = computeMetrics(trades, equityCurve, config.initialBalance);
  return { trades, equityCurve, metrics };
}

const api = { runBacktest };
export type BacktestWorkerApi = typeof api;

Comlink.expose(api);
