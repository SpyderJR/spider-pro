import { useQuery } from "@tanstack/react-query";
import { fetchAllUsdtTickers } from "../lib/binance/rest";

/** The full USDT spot pair list rarely changes — a 5 minute cache means opening the search box
 * repeatedly across a session costs one real network request, not one per open. */
export function useBinancePairs() {
  return useQuery({
    queryKey: ["binance-all-usdt-pairs"],
    queryFn: fetchAllUsdtTickers,
    staleTime: 5 * 60_000,
  });
}
