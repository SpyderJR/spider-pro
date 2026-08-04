import type { Asset, Candle, CoinMarketData, PricePoint } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";
import { COINGECKO_ID } from "./symbols.js";

type OhlcTuple = [number, number, number, number, number];

/** Last-resort daily candles — CoinGecko's OHLC granularity is coarse but always available. */
export async function fetchCoinGeckoDailyKlinesById(
  coingeckoId: string,
  days: number,
): Promise<Candle[]> {
  const url = `${env.COINGECKO_BASE_URL}/api/v3/coins/${coingeckoId}/ohlc?vs_currency=usd&days=${days}`;
  const raw = await fetchJson<OhlcTuple[]>("coingecko", url);
  return raw.map(([time, open, high, low, close]) => ({
    time: Math.floor(time / 1000),
    open,
    high,
    low,
    close,
    volume: 0,
  }));
}

export async function fetchCoinGeckoDailyKlines(asset: Asset, days: number): Promise<Candle[]> {
  return fetchCoinGeckoDailyKlinesById(COINGECKO_ID[asset], days);
}

export interface CoinGeckoSearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
  marketCapRank: number | null;
}

/** Powers the token search box — CoinGecko's fuzzy search across every listed coin. */
export async function searchCoinGeckoTokens(query: string): Promise<CoinGeckoSearchResult[]> {
  const url = `${env.COINGECKO_BASE_URL}/api/v3/search?query=${encodeURIComponent(query)}`;
  const raw = await fetchJson<{
    coins: Array<{ id: string; symbol: string; name: string; thumb: string; market_cap_rank: number | null }>;
  }>("coingecko", url);
  return raw.coins.slice(0, 8).map((c) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    thumb: c.thumb,
    marketCapRank: c.market_cap_rank ?? null,
  }));
}

interface CoinGeckoMarketEntry {
  id: string;
  current_price: number;
  market_cap: number;
  ath: number;
  ath_change_percentage: number;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  price_change_percentage_30d_in_currency?: number | null;
  price_change_percentage_1y_in_currency?: number | null;
}

export async function fetchCoinGeckoMarkets(assets: Asset[]): Promise<CoinMarketData[]> {
  const ids = assets.map((a) => COINGECKO_ID[a]).join(",");
  const url =
    `${env.COINGECKO_BASE_URL}/api/v3/coins/markets?vs_currency=usd&ids=${ids}` +
    `&price_change_percentage=1h,24h,7d,30d,1y`;
  const raw = await fetchJson<CoinGeckoMarketEntry[]>("coingecko", url);

  const byId = new Map(raw.map((entry) => [entry.id, entry]));
  const now = Date.now();

  return assets
    .map((asset) => {
      const entry = byId.get(COINGECKO_ID[asset]);
      if (!entry) return null;
      const data: CoinMarketData = {
        id: entry.id,
        symbol: asset,
        price: entry.current_price,
        marketCap: entry.market_cap,
        ath: entry.ath,
        athChangePercent: entry.ath_change_percentage,
        change1h: entry.price_change_percentage_1h_in_currency ?? null,
        change24h: entry.price_change_percentage_24h_in_currency ?? null,
        change7d: entry.price_change_percentage_7d_in_currency ?? null,
        change30d: entry.price_change_percentage_30d_in_currency ?? null,
        change1y: entry.price_change_percentage_1y_in_currency ?? null,
        updatedAt: now,
      };
      return data;
    })
    .filter((d): d is CoinMarketData => d !== null);
}

interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
}

export async function fetchCoinGeckoHistory(asset: Asset, days: number): Promise<PricePoint[]> {
  const id = COINGECKO_ID[asset];
  const url = `${env.COINGECKO_BASE_URL}/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  const raw = await fetchJson<CoinGeckoMarketChartResponse>("coingecko", url);
  return raw.prices.map(([time, price]) => ({ time: Math.floor(time / 1000), price }));
}

// NOTE: there used to be a fetchCoinGeckoStablecoinSupply() here, used as a fallback for
// /api/market/stablecoins when TronScan is unavailable. Removed — CoinGecko only exposes each
// stablecoin's GLOBAL circulating supply across every chain it's issued on, which is a
// fundamentally different number from "supply on TRON" and was silently mislabeling e.g.
// USDC's ~$70B global supply as TRON-specific (real TRON supply is ~$27M). See
// lib/staticFallback.ts's STABLECOIN_STATIC_FALLBACK for the fallback used instead.
