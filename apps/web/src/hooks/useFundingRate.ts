import { useQuery } from "@tanstack/react-query";
import { fetchFundingRate } from "../lib/binance/futures";

export function useFundingRate(symbol: string) {
  return useQuery({
    queryKey: ["binance-funding-rate", symbol],
    queryFn: () => fetchFundingRate(symbol),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}
