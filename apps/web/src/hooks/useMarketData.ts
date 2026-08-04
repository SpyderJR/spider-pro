import { useQuery } from "@tanstack/react-query";
import type { Asset, Timeframe } from "@spider/types";
import * as api from "../lib/api";

export function useKlines(symbol: string, interval: Timeframe, limit = 300, coingeckoId?: string) {
  return useQuery({
    queryKey: ["klines", symbol, interval, limit, coingeckoId],
    queryFn: () => api.fetchKlines(symbol, interval, limit, coingeckoId),
    refetchInterval: 30_000,
  });
}

export function useMarketCoins(ids = "bitcoin,tron") {
  return useQuery({
    queryKey: ["market-coins", ids],
    queryFn: () => api.fetchMarketCoins(ids),
    refetchInterval: 30_000,
  });
}

export function useMarketHistory(asset: Asset, days = 30) {
  return useQuery({
    queryKey: ["market-history", asset, days],
    queryFn: () => api.fetchMarketHistory(asset, days),
    refetchInterval: 60_000,
  });
}

export function useFearGreed() {
  return useQuery({
    queryKey: ["fear-greed"],
    queryFn: api.fetchFearGreed,
    refetchInterval: 5 * 60_000,
  });
}

export function useM2() {
  return useQuery({
    queryKey: ["m2"],
    queryFn: api.fetchM2,
    refetchInterval: 60 * 60_000,
  });
}

export function useDxy() {
  return useQuery({
    queryKey: ["dxy"],
    queryFn: api.fetchDxy,
    refetchInterval: 60 * 60_000,
  });
}

export function useFedFunds() {
  return useQuery({
    queryKey: ["fedfunds"],
    queryFn: api.fetchFedFunds,
    refetchInterval: 60 * 60_000,
  });
}

export function useSp500() {
  return useQuery({
    queryKey: ["sp500"],
    queryFn: api.fetchSp500,
    refetchInterval: 60 * 60_000,
  });
}

export function useFearGreedHistory() {
  return useQuery({
    queryKey: ["fear-greed-history"],
    queryFn: api.fetchFearGreedHistory,
    staleTime: 60 * 60_000,
    refetchInterval: 6 * 60 * 60_000,
  });
}

export function useStablecoins() {
  return useQuery({
    queryKey: ["stablecoins"],
    queryFn: api.fetchStablecoins,
    refetchInterval: 60_000,
  });
}

export function useTronStats() {
  return useQuery({
    queryKey: ["tron-stats"],
    queryFn: api.fetchTronStats,
    refetchInterval: 60_000,
  });
}

export function useBitcoinStats() {
  return useQuery({
    queryKey: ["bitcoin-stats"],
    queryFn: api.fetchBitcoinStats,
    refetchInterval: 60_000,
  });
}
