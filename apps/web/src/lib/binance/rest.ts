import type { BinanceCandle, Ticker24h } from "./types";

// Called directly from the browser (not through our backend) — Binance's public REST
// endpoints allow CORS, and this sidesteps the datacenter-IP geo-blocking that affects
// server-side calls from Netlify Functions (each visitor's own residential IP hits
// Binance directly here).
const BASE = "https://api.binance.com";

export async function fetchBinanceKlines(
  symbol: string,
  interval: string,
  limit = 500,
  range?: { startTime: number; endTime: number },
): Promise<BinanceCandle[]> {
  const rangeParams = range ? `&startTime=${range.startTime}&endTime=${range.endTime}` : "";
  const res = await fetch(
    `${BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}${rangeParams}`,
  );
  if (!res.ok) throw new Error(`binance klines HTTP ${res.status}`);
  const raw = (await res.json()) as unknown[][];
  return raw.map((k) => ({
    time: Math.floor(Number(k[0]) / 1000),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
  }));
}

export async function fetchBinanceTicker24h(symbol: string): Promise<Ticker24h> {
  const res = await fetch(`${BASE}/api/v3/ticker/24hr?symbol=${symbol}`);
  if (!res.ok) throw new Error(`binance ticker HTTP ${res.status}`);
  const raw = await res.json();
  return {
    symbol: raw.symbol,
    lastPrice: Number(raw.lastPrice),
    priceChangePercent: Number(raw.priceChangePercent),
    highPrice: Number(raw.highPrice),
    lowPrice: Number(raw.lowPrice),
    volume: Number(raw.volume),
    quoteVolume: Number(raw.quoteVolume),
  };
}
