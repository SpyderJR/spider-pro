import type { BinanceCandle } from "../binance/types";
import { fetchBinanceKlinesPaginated } from "../binance/paginatedKlines";
import { idbGet, idbSet } from "../idbCache";

/**
 * Same cache key scheme as `lib/arcade/historicalCandles.ts` (historical candles never
 * change once closed, so a cached range is valid forever) — extended here to cover ranges
 * spanning more than 1000 candles via pagination.
 */
export async function fetchBacktestCandles(
  symbol: string,
  interval: string,
  startTime: number,
  endTime: number,
  onProgress?: (fetchedCount: number) => void,
): Promise<BinanceCandle[]> {
  const key = `candles:${symbol}:${interval}:${startTime}:${endTime}`;
  const cached = await idbGet<BinanceCandle[]>(key);
  if (cached && cached.length > 0) return cached;

  const candles = await fetchBinanceKlinesPaginated(symbol, interval, startTime, endTime, onProgress);
  if (candles.length > 0) await idbSet(key, candles);
  return candles;
}
