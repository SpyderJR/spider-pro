import { useEffect, useRef } from "react";
import * as Comlink from "comlink";
import type { BacktestConfig, BacktestResult } from "@spider/types";
import type { BinanceCandle } from "../lib/binance/types";
import type { BacktestWorkerApi } from "../workers/backtest.worker";

export function useBacktestWorker() {
  const workerRef = useRef<Worker>();
  const apiRef = useRef<Comlink.Remote<BacktestWorkerApi>>();

  useEffect(() => {
    const worker = new Worker(new URL("../workers/backtest.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    apiRef.current = Comlink.wrap<BacktestWorkerApi>(worker);
    return () => worker.terminate();
  }, []);

  async function runBacktest(candles: BinanceCandle[], config: BacktestConfig): Promise<BacktestResult> {
    if (!apiRef.current) throw new Error("Backtest worker not ready yet");
    return apiRef.current.runBacktest(candles, config);
  }

  return { runBacktest };
}
