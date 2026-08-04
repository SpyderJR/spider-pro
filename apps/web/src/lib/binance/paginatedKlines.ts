import { fetchBinanceKlines } from "./rest";
import type { BinanceCandle } from "./types";

const INTERVAL_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "1h": 60 * 60_000,
  "4h": 4 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  "1w": 7 * 24 * 60 * 60_000,
};

function intervalToMs(interval: string): number {
  return INTERVAL_MS[interval] ?? 60 * 60_000;
}

// Safety valve so a mistaken date range (or an interval/range combo spanning an
// unreasonable number of candles) can't loop forever hammering Binance.
const MAX_ITERATIONS = 500;

/**
 * Pages backward through Binance's public klines REST endpoint (capped at 1000 candles per
 * request) to cover an arbitrary date range — needed for the backtester, which routinely asks
 * for years of history that a single request can't return.
 */
export async function fetchBinanceKlinesPaginated(
  symbol: string,
  interval: string,
  startTime: number,
  endTime: number,
  onProgress?: (fetchedCount: number) => void,
): Promise<BinanceCandle[]> {
  const all: BinanceCandle[] = [];
  let cursor = startTime;
  let iterations = 0;
  const stepMs = intervalToMs(interval);

  while (cursor < endTime && iterations < MAX_ITERATIONS) {
    iterations += 1;
    const batch = await fetchBinanceKlines(symbol, interval, 1000, { startTime: cursor, endTime });
    if (batch.length === 0) break;

    const lastKnownTimeMs = all.length > 0 ? all[all.length - 1]!.time * 1000 : -Infinity;
    const newOnes = batch.filter((c) => c.time * 1000 > lastKnownTimeMs);
    all.push(...newOnes);
    onProgress?.(all.length);

    if (batch.length < 1000) break; // fewer than a full page back means we hit the range's end
    cursor = batch[batch.length - 1]!.time * 1000 + stepMs;
  }

  return all;
}
