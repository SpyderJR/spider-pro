import { useEffect, useRef } from "react";
import * as Comlink from "comlink";
import type { MonteCarloParams, MonteCarloResult } from "../lib/riskMath";
import type { MonteCarloWorkerApi } from "../workers/montecarlo.worker";

/** Same Comlink worker pattern as useBacktestWorker — 1000 iterations x N trades stays cheap
 * in absolute terms, but running it off the main thread means it never competes with a slider
 * drag or chart re-render regardless of how high the user pushes iterations/trades. */
export function useMonteCarloWorker() {
  const workerRef = useRef<Worker>();
  const apiRef = useRef<Comlink.Remote<MonteCarloWorkerApi>>();

  useEffect(() => {
    const worker = new Worker(new URL("../workers/montecarlo.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    apiRef.current = Comlink.wrap<MonteCarloWorkerApi>(worker);
    return () => worker.terminate();
  }, []);

  async function runMonteCarlo(params: MonteCarloParams, iterations = 1000): Promise<MonteCarloResult> {
    if (!apiRef.current) throw new Error("Monte Carlo worker not ready yet");
    return apiRef.current.runMonteCarlo(params, iterations);
  }

  return { runMonteCarlo };
}
