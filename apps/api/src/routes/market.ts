import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  AssetSchema,
  ASSETS,
  type Asset,
  type M2Response,
  type MarketCoinsResponse,
  type MarketHistoryResponse,
  type StablecoinsResponse,
  StablecoinSymbolSchema,
} from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import { fetchCoinGeckoHistory, fetchCoinGeckoMarkets, fetchCoinGeckoStablecoinSupply } from "../providers/coingecko.js";
import { fetchCryptoCompareDailyHistory } from "../providers/cryptocompare.js";
import { fetchFearGreed } from "../providers/alternativeMe.js";
import { fetchM2Series } from "../providers/fred.js";
import { fetchTronStablecoinSupply } from "../providers/tron.js";
import { M2_STATIC_FALLBACK, STABLECOIN_STATIC_FALLBACK } from "../lib/staticFallback.js";

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

          try {
            const cgResults = await Promise.all(
              symbols.map((symbol) => fetchCoinGeckoStablecoinSupply(symbol)),
            );
            if (cgResults.every((r) => r !== null)) {
              const stablecoins = symbols.map((symbol, i) => ({
                symbol,
                supply: cgResults[i]!,
                holders: null,
              }));
              return {
                stablecoins,
                totalSupply: stablecoins.reduce((sum, s) => sum + s.supply, 0),
                source: "coingecko" as const,
                live: true,
              };
            }
          } catch (err) {
            request.log.warn({ err }, "market/stablecoins: CoinGecko fallback failed too");
          }

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
