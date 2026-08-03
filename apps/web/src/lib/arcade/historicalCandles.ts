import type { BinanceCandle } from "../binance/types";
import { fetchBinanceKlines } from "../binance/rest";
import { idbGet, idbSet } from "../idbCache";

/**
 * Fetches a fixed historical window (candles never change once closed) and caches
 * it in IndexedDB so repeated Arcade rounds / page reloads don't re-hit Binance.
 */
export async function fetchCachedCandles(
  symbol: string,
  interval: string,
  startTime: number,
  endTime: number,
): Promise<BinanceCandle[]> {
  const key = `candles:${symbol}:${interval}:${startTime}:${endTime}`;
  const cached = await idbGet<BinanceCandle[]>(key);
  if (cached && cached.length > 0) return cached;

  const candles = await fetchBinanceKlines(symbol, interval, 1000, { startTime, endTime });
  if (candles.length > 0) await idbSet(key, candles);
  return candles;
}

/** BTCUSDT has traded on Binance since mid-2017; safe lower bound for random historical windows. */
export const BINANCE_HISTORY_START = new Date("2017-09-01T00:00:00Z").getTime();

export function randomHistoricalWindow(spanMs: number, latestEnd = Date.now() - 30 * 24 * 60 * 60 * 1000): { startTime: number; endTime: number } {
  const earliestStart = BINANCE_HISTORY_START;
  const latestStart = latestEnd - spanMs;
  const startTime = Math.floor(earliestStart + Math.random() * Math.max(0, latestStart - earliestStart));
  return { startTime, endTime: startTime + Math.floor(spanMs) };
}
