import type { FastifyInstance } from "fastify";
import type { TronStatsResponse } from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import { fetchTronGridBlockHeight, fetchTronScanStats, fetchTronStablecoinSupply } from "../providers/tron.js";
import { TRON_STATIC_FALLBACK } from "../lib/staticFallback.js";

export function registerTronRoutes(app: FastifyInstance) {
  app.get("/api/tron/stats", async (request, reply) => {
    try {
      const result = await cache.wrap<TronStatsResponse>("tron:stats", TTL.tronStats, async () => {
        // Attempt 1: TronScan with API key.
        try {
          const stats = await fetchTronScanStats(true);
          const usdt = await fetchTronStablecoinSupply("USDT");
          return {
            ...stats,
            usdtSupply: usdt?.supply ?? null,
            source: "tronscan" as const,
            live: true,
            updatedAt: Date.now(),
          };
        } catch (err) {
          request.log.warn({ err }, "tron/stats: TronScan (with key) failed, retrying without key");
        }

        // Attempt 2: TronScan without key.
        try {
          const stats = await fetchTronScanStats(false);
          const usdt = await fetchTronStablecoinSupply("USDT");
          return {
            ...stats,
            usdtSupply: usdt?.supply ?? null,
            source: "tronscan-nokey" as const,
            live: true,
            updatedAt: Date.now(),
          };
        } catch (err) {
          request.log.warn({ err }, "tron/stats: TronScan (no key) failed, falling back to TronGrid");
        }

        // Attempt 3: TronGrid — partial data (block height only).
        try {
          const blockHeight = await fetchTronGridBlockHeight();
          return {
            totalAccounts: null,
            totalTransactions: null,
            tps: null,
            tvl: null,
            totalNodes: null,
            totalContracts: null,
            usdtSupply: null,
            blockHeight,
            source: "trongrid" as const,
            live: true,
            updatedAt: Date.now(),
          };
        } catch (err) {
          request.log.warn({ err }, "tron/stats: TronGrid failed too, using static reference dataset");
        }

        // Attempt 4: static reference values, so the section is never empty.
        return {
          ...TRON_STATIC_FALLBACK,
          source: "static-fallback" as const,
          live: false,
          updatedAt: Date.now(),
        };
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "tron/stats failed unexpectedly");
      return reply.status(502).send({ error: "tron stats unavailable" });
    }
  });
}
