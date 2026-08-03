import { useQuery } from "@tanstack/react-query";
import { fetchCachedCandles } from "../lib/arcade/historicalCandles";

const OUTCOME_WINDOW_DAYS = 90;

export interface HistoricalAnalogOutcome {
  startPrice: number;
  endPrice: number;
  changePercent: number;
  days: number;
}

/** Precio real de BTC en los ~90 días siguientes a una fecha histórica dada (Binance, cacheado en IndexedDB). */
export function useHistoricalAnalogOutcome(matchTimeSeconds: number | null) {
  return useQuery<HistoricalAnalogOutcome | null>({
    queryKey: ["historical-analog-outcome", matchTimeSeconds],
    queryFn: async () => {
      const startTime = matchTimeSeconds! * 1000;
      const endTime = Math.min(startTime + OUTCOME_WINDOW_DAYS * 24 * 60 * 60 * 1000, Date.now());
      const candles = await fetchCachedCandles("BTCUSDT", "1d", startTime, endTime);
      if (candles.length < 2) return null;
      const startPrice = candles[0]!.close;
      const endPrice = candles.at(-1)!.close;
      return {
        startPrice,
        endPrice,
        changePercent: ((endPrice - startPrice) / startPrice) * 100,
        days: candles.length - 1,
      };
    },
    enabled: matchTimeSeconds !== null,
    staleTime: Infinity,
  });
}
