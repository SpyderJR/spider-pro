import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  AssetSchema,
  ASSETS,
  type Asset,
  type M2Response,
  type MacroSeriesResponse,
  type MarketCoinsResponse,
  type MarketHistoryResponse,
  type StablecoinsResponse,
  StablecoinSymbolSchema,
} from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import { fetchCoinGeckoHistory, fetchCoinGeckoMarkets } from "../providers/coingecko.js";
import { fetchCryptoCompareDailyHistory } from "../providers/cryptocompare.js";
import { fetchFearGreed, fetchFearGreedHistory } from "../providers/alternativeMe.js";
import { fetchM2Series, fetchFredSeries } from "../providers/fred.js";
import { fetchTronStablecoinSupply } from "../providers/tron.js";
import {
  M2_STATIC_FALLBACK,
  STABLECOIN_STATIC_FALLBACK,
  DXY_STATIC_FALLBACK,
  FEDFUNDS_STATIC_FALLBACK,
  SP500_STATIC_FALLBACK,
} from "../lib/staticFallback.js";

const CoinsQuerySchema = z.object({
  ids: z.string().default("bitcoin,tron"),
});

const HistoryQuerySchema = z.object({
  asset: AssetSchema,
  days: z.coerce.number().int().min(1).max(3650).default(30),
});

export function registerMarketRoutes(app: FastifyInstance) {
  app.get("/api/market/coins", async (request, reply) => {
    const parsed = CoinsQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.status(400).send({ error: "invalid query" });

    const assets: Asset[] = parsed.data.ids
      .split(",")
      .map((id) => (id.trim() === "bitcoin" ? "BTC" : id.trim() === "tron" ? "TRX" : null))
      .filter((a): a is Asset => a !== null);

    const finalAssets = assets.length > 0 ? assets : [...ASSETS];
    const cacheKey = `market:coins:${finalAssets.join(",")}`;

    try {
      const result = await cache.wrap<MarketCoinsResponse>(cacheKey, TTL.price, async () => ({
        coins: await fetchCoinGeckoMarkets(finalAssets),
        source: "coingecko" as const,
      }));
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "market/coins failed");
      return reply.status(502).send({ error: "market data provider unavailable" });
    }
  });

  app.get("/api/market/history", async (request, reply) => {
    const parsed = HistoryQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.status(400).send({ error: "invalid query" });
    // CoinGecko's public API hard-limits historical range to the past 365 days (error 10012)
    // for non-paid keys — clamp here so callers requesting a longer window degrade instead of 502ing.
    const days = Math.min(parsed.data.days, 365);
    const { asset } = parsed.data;
    const cacheKey = `market:history:${asset}:${days}`;

    try {
      const result = await cache.wrap<MarketHistoryResponse>(cacheKey, TTL.price, async () => {
        try {
          return { asset, days, points: await fetchCoinGeckoHistory(asset, days), source: "coingecko" as const };
        } catch (err) {
          request.log.warn(
            { err: err instanceof Error ? err.message : err, asset, days },
            "market/history: CoinGecko failed, falling back to CryptoCompare",
          );
          return {
            asset,
            days,
            points: await fetchCryptoCompareDailyHistory(asset, days),
            source: "cryptocompare" as const,
          };
        }
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err, asset, days }, "market/history failed");
      return reply.status(502).send({ error: "market history provider unavailable" });
    }
  });

  app.get("/api/market/fear-greed", async (request, reply) => {
    try {
      const result = await cache.wrap("market:fear-greed", TTL.fearGreed, fetchFearGreed);
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "market/fear-greed failed");
      return reply.status(502).send({ error: "fear & greed provider unavailable" });
    }
  });

  app.get("/api/market/fear-greed-history", async (request, reply) => {
    try {
      const result = await cache.wrap("market:fear-greed-history", TTL.fearGreedHistory, fetchFearGreedHistory);
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "market/fear-greed-history failed");
      return reply.status(502).send({ error: "fear & greed history provider unavailable" });
    }
  });

  app.get("/api/market/m2", async (request, reply) => {
    try {
      const result = await cache.wrap<M2Response>("market:m2", TTL.m2, async () => {
        try {
          const fredPoints = await fetchM2Series();
          const points = fredPoints.map((p) => ({
            time: p.time,
            m2: p.value,
            btcPrice: null,
            trxPrice: null,
          }));
          return { points, source: "fred" as const, live: true };
        } catch (err) {
          request.log.warn({ err }, "market/m2: FRED unavailable, using static reference dataset");
          return { points: M2_STATIC_FALLBACK, source: "static-fallback" as const, live: false };
        }
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "market/m2 failed");
      return reply.status(502).send({ error: "m2 provider unavailable" });
    }
  });

  const MACRO_SERIES: Record<string, { fredId: string; fallback: MacroSeriesResponse["points"] }> = {
    dxy: { fredId: "DTWEXBGS", fallback: DXY_STATIC_FALLBACK },
    fedfunds: { fredId: "FEDFUNDS", fallback: FEDFUNDS_STATIC_FALLBACK },
    sp500: { fredId: "SP500", fallback: SP500_STATIC_FALLBACK },
  };

  for (const [route, { fredId, fallback }] of Object.entries(MACRO_SERIES)) {
    app.get(`/api/market/${route}`, async (request, reply) => {
      try {
        const result = await cache.wrap<MacroSeriesResponse>(`market:${route}`, TTL.macro, async () => {
          try {
            const fredPoints = await fetchFredSeries(fredId);
            const points = fredPoints.map((p) => ({ time: p.time, value: p.value }));
            return { points, source: "fred" as const, live: true };
          } catch (err) {
            request.log.warn({ err }, `market/${route}: FRED unavailable, using static reference dataset`);
            return { points: fallback, source: "static-fallback" as const, live: false };
          }
        });
        return reply.send(result);
      } catch (err) {
        request.log.error({ err }, `market/${route} failed`);
        return reply.status(502).send({ error: `${route} provider unavailable` });
      }
    });
  }

  app.get("/api/market/stablecoins", async (request, reply) => {
    try {
      const result = await cache.wrap<StablecoinsResponse>(
        "market:stablecoins",
        TTL.stablecoins,
        async () => {
          const symbols = StablecoinSymbolSchema.options;
          const tronResults = await Promise.all(
            symbols.map((symbol) => fetchTronStablecoinSupply(symbol)),
          );

          if (tronResults.every((r) => r !== null)) {
            const stablecoins = symbols.map((symbol, i) => ({
              symbol,
              supply: tronResults[i]!.supply,
              holders: tronResults[i]!.holders,
            }));
            return {
              stablecoins,
              totalSupply: stablecoins.reduce((sum, s) => sum + s.supply, 0),
              source: "tronscan" as const,
              live: true,
            };
          }

          // Deliberately no CoinGecko fallback here: CoinGecko only exposes each
          // stablecoin's GLOBAL circulating supply across every chain it's issued on
          // (e.g. USDC is ~$70B+ across all of Ethereum/Solana/Base/etc., but only
          // ~$27M of that is actually on TRON). Showing that number on a page titled
          // "Stablecoins TRON" would silently mislabel global supply as TRON-specific —
          // confirmed as a real bug by comparing against tronscan.org directly. The
          // static reference dataset below is at least conceptually TRON-specific.
          request.log.warn("market/stablecoins: TronScan unavailable, using static reference dataset");

          return {
            stablecoins: STABLECOIN_STATIC_FALLBACK,
            totalSupply: STABLECOIN_STATIC_FALLBACK.reduce((sum, s) => sum + s.supply, 0),
            source: "static-fallback" as const,
            live: false,
          };
        },
      );
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "market/stablecoins failed");
      return reply.status(502).send({ error: "stablecoins provider unavailable" });
    }
  });
}
