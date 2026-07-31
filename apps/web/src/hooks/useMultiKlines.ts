import { useQueries } from "@tanstack/react-query";
import type { Timeframe } from "@spider/types";
import { fetchKlines } from "../lib/api";

export function useMultiKlines(
  symbol: string,
  timeframes: readonly Timeframe[],
  limit = 120,
  coingeckoId?: string,
) {
  return useQueries({
    queries: timeframes.map((tf) => ({
      queryKey: ["klines", symbol, tf, limit, coingeckoId],
      queryFn: () => fetchKlines(symbol, tf, limit, coingeckoId),
      refetchInterval: 30_000,
    })),
  });
}
