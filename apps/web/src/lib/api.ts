import {
  KlinesResponseSchema,
  MarketCoinsResponseSchema,
  MarketHistoryResponseSchema,
  FearGreedResponseSchema,
  M2ResponseSchema,
  StablecoinsResponseSchema,
  TronStatsResponseSchema,
  ChatResponseSchema,
  TokenSearchResponseSchema,
  type Asset,
  type Timeframe,
  type ChatMessage,
} from "@spider/types";
import { z } from "zod";

async function getJson<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  const json = await res.json();
  return schema.parse(json);
}

export function fetchKlines(symbol: string, interval: Timeframe, limit = 300, coingeckoId?: string) {
  const idParam = coingeckoId ? `&coingeckoId=${encodeURIComponent(coingeckoId)}` : "";
  return getJson(
    `/api/klines?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}${idParam}`,
    KlinesResponseSchema,
  );
}

export function searchTokens(query: string) {
  return getJson(`/api/market/search?query=${encodeURIComponent(query)}`, TokenSearchResponseSchema);
}

export function fetchMarketCoins(ids: string = "bitcoin,tron") {
  return getJson(`/api/market/coins?ids=${ids}`, MarketCoinsResponseSchema);
}

export function fetchMarketHistory(asset: Asset, days = 30) {
  return getJson(`/api/market/history?asset=${asset}&days=${days}`, MarketHistoryResponseSchema);
}

export function fetchFearGreed() {
  return getJson(`/api/market/fear-greed`, FearGreedResponseSchema);
}

export function fetchM2() {
  return getJson(`/api/market/m2`, M2ResponseSchema);
}

export function fetchStablecoins() {
  return getJson(`/api/market/stablecoins`, StablecoinsResponseSchema);
}

export function fetchTronStats() {
  return getJson(`/api/tron/stats`, TronStatsResponseSchema);
}

export async function postChat(
  message: string,
  page: string,
  context: Record<string, unknown> | undefined,
  history: ChatMessage[],
) {
  const res = await fetch(`/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, page, context, history }),
  });
  const json = await res.json();
  return ChatResponseSchema.parse(json);
}
