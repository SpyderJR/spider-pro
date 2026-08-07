import { useQuery } from "@tanstack/react-query";
import { fetchOpenInterest } from "../lib/binance/futures";

export function useOpenInterest(symbol: string) {
  return useQuery({
    queryKey: ["binance-open-interest", symbol],
    queryFn: () => fetchOpenInterest(symbol),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
