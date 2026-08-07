import * as Comlink from "comlink";
import { runMonteCarloSimulation, type MonteCarloParams, type MonteCarloResult } from "../lib/riskMath";

function runMonteCarlo(params: MonteCarloParams, iterations: number): MonteCarloResult {
  return runMonteCarloSimulation(params, iterations);
}

const api = { runMonteCarlo };
export type MonteCarloWorkerApi = typeof api;

Comlink.expose(api);
