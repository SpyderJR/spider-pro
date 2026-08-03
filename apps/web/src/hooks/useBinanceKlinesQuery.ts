import { useQuery } from "@tanstack/react-query";
import { fetchBinanceKlines } from "../lib/binance/rest";

export function useBinanceKlinesQuery(symbol: string, interval: string, limit = 300) {
  return useQuery({
    queryKey: ["binance-klines", symbol, interval, limit],
    queryFn: () => fetchBinanceKlines(symbol, interval, limit),
    staleTime: 30_000,
  });
}
