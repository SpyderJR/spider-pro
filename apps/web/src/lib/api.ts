import {
  KlinesResponseSchema,
  MarketCoinsResponseSchema,
  MarketHistoryResponseSchema,
  FearGreedResponseSchema,
  FearGreedHistoryResponseSchema,
  M2ResponseSchema,
  MacroSeriesResponseSchema,
  StablecoinsResponseSchema,
  TronStatsResponseSchema,
  BitcoinStatsResponseSchema,
  ChatResponseSchema,
  TokenSearchResponseSchema,
  RecentTokenCreationsResponseSchema,
  MemeTokenSummarySchema,
  MemeHoldersResponseSchema,
  MemeClusteringResponseSchema,
  MemeActivityResponseSchema,
  MemeTransfersResponseSchema,
  WhaleListResponseSchema,
  WhaleDetailResponseSchema,
  type Asset,
  type Timeframe,
  type ChatMessage,
} from "@spider/types";
import { z } from "zod";
import { fetchBinanceKlines } from "./binance/rest";
import type { KlinesResponse } from "@spider/types";

async function getJson<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  const json = await res.json();
  return schema.parse(json);
}

export async function fetchKlines(
  symbol: string,
  interval: Timeframe,
  limit = 300,
  coingeckoId?: string,
): Promise<KlinesResponse> {
  const idParam = coingeckoId ? `&coingeckoId=${encodeURIComponent(coingeckoId)}` : "";
  try {
    return await getJson(
      `/api/klines?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}${idParam}`,
      KlinesResponseSchema,
    );
  } catch (err) {
    // Los proveedores del servidor (Binance/Bybit/CryptoCompare) pueden estar todos
    // bloqueados o agotados desde la misma IP de nube al mismo tiempo — como último
    // recurso, pedimos las velas directo a Binance desde el propio navegador del
    // visitante (su IP residencial no está bloqueada), el mismo truco que ya usan la
    // Terminal y el Arcade.
    const candles = await fetchBinanceKlines(`${symbol.toUpperCase()}USDT`, interval, limit);
    if (candles.length === 0) throw err;
    return { symbol, interval, source: "binance", candles };
  }
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

export function fetchDxy() {
  return getJson(`/api/market/dxy`, MacroSeriesResponseSchema);
}

export function fetchFedFunds() {
  return getJson(`/api/market/fedfunds`, MacroSeriesResponseSchema);
}

export function fetchSp500() {
  return getJson(`/api/market/sp500`, MacroSeriesResponseSchema);
}

export function fetchFearGreedHistory() {
  return getJson(`/api/market/fear-greed-history`, FearGreedHistoryResponseSchema);
}

export function fetchStablecoins() {
  return getJson(`/api/market/stablecoins`, StablecoinsResponseSchema);
}

export function fetchTronStats() {
  return getJson(`/api/tron/stats`, TronStatsResponseSchema);
}

export function fetchBitcoinStats() {
  return getJson(`/api/bitcoin/stats`, BitcoinStatsResponseSchema);
}

export function fetchRecentMemeTokens() {
  return getJson(`/api/meme/recent`, RecentTokenCreationsResponseSchema);
}

export function fetchMemeActivity() {
  return getJson(`/api/meme/activity`, MemeActivityResponseSchema);
}

export function fetchMemeToken(address: string) {
  return getJson(`/api/meme/token/${address}`, MemeTokenSummarySchema);
}

export function fetchMemeHolders(address: string) {
  return getJson(`/api/meme/token/${address}/holders`, MemeHoldersResponseSchema);
}

export function fetchMemeTransfers(address: string) {
  return getJson(`/api/meme/token/${address}/transfers`, MemeTransfersResponseSchema);
}

export function fetchMemeClustering(address: string) {
  return getJson(`/api/meme/token/${address}/clustering`, MemeClusteringResponseSchema);
}

export function fetchWhales() {
  return getJson(`/api/whales`, WhaleListResponseSchema);
}

export function fetchWhaleDetail(id: string) {
  return getJson(`/api/whales/${id}`, WhaleDetailResponseSchema);
}

export async function postChat(
  message: string,
  page: string,
  context: Record<string, unknown> | undefined,
  history: ChatMessage[],
  accessToken?: string | null,
) {
  const res = await fetch(`/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ message, page, context, history }),
  });
  const json = await res.json();
  return ChatResponseSchema.parse(json);
}
