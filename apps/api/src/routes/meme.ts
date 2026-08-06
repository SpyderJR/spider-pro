import type { FastifyInstance } from "fastify";
import type {
  ClusterGroup,
  MemeActivityResponse,
  MemeHoldersResponse,
  MemeTokenSummary,
  MemeTransfersResponse,
  RecentTokenCreationsResponse,
} from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import {
  fetchHolderFundingSource,
  fetchRecentActivity,
  fetchRecentTokenCreations,
  fetchTokenBasicInfo,
  fetchTokenHolders,
  fetchTokenMarketData,
  fetchTokenTransfers,
  SUNPUMP_CONTRACT,
} from "../providers/sunpump.js";

// Holders analyzed per clustering run — capped to stay well within TronGrid's free rate limit
// (each holder needs its own funding-source lookup) and to keep response times reasonable.
const CLUSTERING_HOLDER_CAP = 25;

export function registerMemeRoutes(app: FastifyInstance) {
  app.get("/api/meme/recent", async (request, reply) => {
    try {
      const result = await cache.wrap<RecentTokenCreationsResponse>(
        "meme:recent",
        TTL.memeRecent,
        async () => {
          const tokens = await fetchRecentTokenCreations(20);
          return { tokens, source: "trongrid" as const, live: true, updatedAt: Date.now() };
        },
      );
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "meme/recent failed");
      return reply.status(502).send({ error: "meme recent tokens unavailable" });
    }
  });

  app.get("/api/meme/activity", async (request, reply) => {
    try {
      const result = await cache.wrap<MemeActivityResponse>("meme:activity", TTL.memeActivity, async () => {
        const events = await fetchRecentActivity(30);
        return { events, source: "trongrid", live: true, updatedAt: Date.now() };
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "meme/activity failed");
      return reply.status(502).send({ error: "meme activity unavailable" });
    }
  });

  app.get<{ Params: { address: string } }>("/api/meme/token/:address", async (request, reply) => {
    const { address } = request.params;
    try {
      const result = await cache.wrap<MemeTokenSummary>(
        `meme:token:${address}`,
        TTL.memeToken,
        async () => {
          // Independent try/catch per source — a DexScreener hiccup shouldn't blank out the
          // name/symbol TronScan already has, and vice versa. Retries live one layer down in
          // the provider; this is the last-resort fallback if both attempts there still fail.
          const [infoResult, marketResult] = await Promise.allSettled([
            fetchTokenBasicInfo(address),
            fetchTokenMarketData(address),
          ]);
          if (infoResult.status === "rejected" && marketResult.status === "rejected") {
            throw infoResult.reason;
          }
          const info =
            infoResult.status === "fulfilled"
              ? infoResult.value
              : { name: null, symbol: null, decimals: null, totalSupply: null, holdersCount: null };
          const market =
            marketResult.status === "fulfilled"
              ? marketResult.value
              : {
                  status: "bonding-curve" as const,
                  priceUsd: null,
                  liquidityUsd: null,
                  volume24hUsd: null,
                  marketCapUsd: null,
                  dexUrl: null,
                  imageUrl: null,
                };
          return {
            address,
            ...info,
            ...market,
            source: "tronscan+dexscreener",
            live: infoResult.status === "fulfilled" && marketResult.status === "fulfilled",
            updatedAt: Date.now(),
          };
        },
      );
      return reply.send(result);
    } catch (err) {
      request.log.error({ err, address }, "meme/token failed");
      return reply.status(502).send({ error: "meme token data unavailable" });
    }
  });

  app.get<{ Params: { address: string } }>(
    "/api/meme/token/:address/holders",
    async (request, reply) => {
      const { address } = request.params;
      try {
        const result = await cache.wrap<MemeHoldersResponse>(
          `meme:holders:${address}`,
          TTL.memeHolders,
          async () => {
            const raw = await fetchTokenHolders(address, 50);
            const totalSupply = raw.reduce((sum, h) => sum + h.balance, 0) || null;

            // SunPump's own reserve (unsold bonding-curve supply) shows up as the top "holder"
            // pre-graduation — it isn't a buyer, so it's reported separately, not mixed into the
            // holders list (would otherwise dwarf every real wallet in the bubble map).
            const reserve = raw.find((h) => h.address === SUNPUMP_CONTRACT);
            const realHolders = raw.filter((h) => h.address !== SUNPUMP_CONTRACT);

            return {
              address,
              totalSupply,
              holders: realHolders.map((h) => ({
                address: h.address,
                balance: h.balance,
                percentage: totalSupply ? (h.balance / totalSupply) * 100 : null,
              })),
              unsoldReservePercent: reserve && totalSupply ? (reserve.balance / totalSupply) * 100 : null,
              source: "tronscan",
              live: true,
              updatedAt: Date.now(),
            };
          },
        );
        return reply.send(result);
      } catch (err) {
        request.log.error({ err, address }, "meme/token/holders failed");
        return reply.status(502).send({ error: "meme holders unavailable" });
      }
    },
  );

  app.get<{ Params: { address: string } }>(
    "/api/meme/token/:address/transfers",
    async (request, reply) => {
      const { address } = request.params;
      try {
        const result = await cache.wrap<MemeTransfersResponse>(
          `meme:transfers:${address}`,
          TTL.memeTransfers,
          async () => {
            const transfers = await fetchTokenTransfers(address, 50);
            return { address, transfers, source: "tronscan", live: true, updatedAt: Date.now() };
          },
        );
        return reply.send(result);
      } catch (err) {
        request.log.error({ err, address }, "meme/token/transfers failed");
        return reply.status(502).send({ error: "meme transfers unavailable" });
      }
    },
  );

  app.get<{ Params: { address: string } }>(
    "/api/meme/token/:address/clustering",
    async (request, reply) => {
      const { address } = request.params;
      try {
        const result = await cache.wrap(`meme:clustering:${address}`, TTL.memeClustering, async () => {
          const holders = (await fetchTokenHolders(address, CLUSTERING_HOLDER_CAP + 1)).filter(
            (h) => h.address !== SUNPUMP_CONTRACT,
          );

          // Sequential, not Promise.all — one TronGrid call per holder, same rate-limit
          // discipline already used for TronScan's stablecoin fetches.
          const funding: Array<{ address: string; balance: number; source: string | null }> = [];
          for (const holder of holders) {
            const source = await fetchHolderFundingSource(holder.address).catch(() => null);
            funding.push({ address: holder.address, balance: holder.balance, source });
          }

          const bySource = new Map<string, typeof funding>();
          for (const f of funding) {
            if (!f.source) continue;
            const bucket = bySource.get(f.source) ?? [];
            bucket.push(f);
            bySource.set(f.source, bucket);
          }

          const groups: ClusterGroup[] = [];
          for (const [source, members] of bySource) {
            if (members.length < 2) continue; // a "group" of one isn't a cluster
            groups.push({
              fundingSource: source,
              memberAddresses: members.map((m) => m.address),
              combinedBalance: members.reduce((sum, m) => sum + m.balance, 0),
            });
          }

          return {
            address,
            analyzedHolders: holders.length,
            groups,
            isEstimate: true as const,
            updatedAt: Date.now(),
          };
        });
        return reply.send(result);
      } catch (err) {
        request.log.error({ err, address }, "meme/token/clustering failed");
        return reply.status(502).send({ error: "meme clustering unavailable" });
      }
    },
  );
}
