import type { FastifyInstance } from "fastify";
import type {
  ClusterGroup,
  MemeActivityResponse,
  MemeConcentrationRisk,
  MemeCreatorHistoryResponse,
  MemeHoldersResponse,
  MemeTokenSummary,
  MemeTransfersResponse,
  MemeWhaleMove,
  RecentTokenCreationsResponse,
} from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import {
  detectNameSimilarityWarning,
  fetchCreatorTokenHistory,
  fetchHolderFundingSource,
  fetchRecentActivity,
  fetchRecentTokenCreations,
  fetchSunPumpTokenDetail,
  fetchTokenBasicInfo,
  fetchTokenHolders,
  fetchTokenMarketData,
  fetchTokenTransfers,
  SUNPUMP_CONTRACT,
} from "../providers/sunpump.js";

// top10 <30% = "bajo", 30-50% = "medio", >50% = "alto" — the ~50% figure is the most commonly
// cited rug-pull concentration threshold; shown next to the raw % in the UI, never as a bare
// label, so users can judge for themselves rather than trust a single cutoff blindly.
function concentrationRiskFor(top10Percent: number): MemeConcentrationRisk {
  if (top10Percent >= 50) return "alto";
  if (top10Percent >= 30) return "medio";
  return "bajo";
}

// A single transfer moving >=3% of total supply is the threshold used to surface a "whale
// move" banner — small enough to catch real repositioning, large enough that routine trading
// noise on a low-cap token doesn't trigger it on every other transaction.
const WHALE_MOVE_SUPPLY_THRESHOLD_PERCENT = 3;

// Every token's very first transfer mints/seeds ~100% of supply into the bonding curve reserve —
// verified live against a real brand-new token, where this showed up as a false-positive "100%
// whale move" on every single token, not an actual signal. Anything this close to the full
// supply in one transfer is that initialization artifact, not a real holder repositioning.
const WHALE_MOVE_SUPPLY_CEILING_PERCENT = 90;

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
          // Independent try/catch per source — a DexScreener/SunPump hiccup shouldn't blank out
          // the name/symbol TronScan already has, and vice versa. Retries live one layer down
          // in the provider; this is the last-resort fallback if both attempts there still fail.
          const [infoResult, marketResult, sunpumpResult] = await Promise.allSettled([
            fetchTokenBasicInfo(address),
            fetchTokenMarketData(address),
            fetchSunPumpTokenDetail(address),
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
          // SunPump's own logo covers virtually every token (even ones created seconds ago);
          // DexScreener's is a fallback for the rare case SunPump's API itself is unreachable.
          const sunpump = sunpumpResult.status === "fulfilled" ? sunpumpResult.value : null;
          const name = info.name ?? sunpump?.name ?? null;
          const symbol = info.symbol ?? sunpump?.symbol ?? null;
          return {
            address,
            ...info,
            name,
            symbol,
            ...market,
            imageUrl: sunpump?.logoUrl ?? market.imageUrl,
            pumpPercentage: sunpump?.pumpPercentage ?? null,
            creatorAddress: sunpump?.ownerAddress ?? null,
            nameSimilarityWarning: detectNameSimilarityWarning(name, symbol),
            source: "tronscan+dexscreener+sunpump",
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
            const realHolders = raw.filter((h) => h.address !== SUNPUMP_CONTRACT).sort((a, b) => b.balance - a.balance);

            // Concentration is computed against the reserve-excluded supply (what's actually in
            // circulation among real buyers) — including the unsold reserve here would understate
            // concentration risk for tokens still mostly on the bonding curve.
            const circulatingSupply = totalSupply && reserve ? totalSupply - reserve.balance : totalSupply;
            const top10Balance = realHolders.slice(0, 10).reduce((sum, h) => sum + h.balance, 0);
            const top10ConcentrationPercent = circulatingSupply ? (top10Balance / circulatingSupply) * 100 : null;

            return {
              address,
              totalSupply,
              holders: realHolders.map((h) => ({
                address: h.address,
                balance: h.balance,
                percentage: totalSupply ? (h.balance / totalSupply) * 100 : null,
              })),
              unsoldReservePercent: reserve && totalSupply ? (reserve.balance / totalSupply) * 100 : null,
              top10ConcentrationPercent,
              concentrationRisk: top10ConcentrationPercent !== null ? concentrationRiskFor(top10ConcentrationPercent) : null,
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
            const [transfers, info] = await Promise.all([
              fetchTokenTransfers(address, 50),
              fetchTokenBasicInfo(address).catch(() => null),
            ]);

            let recentWhaleMove: MemeWhaleMove | null = null;
            if (info?.totalSupply) {
              const eligible = transfers.filter((t) => (t.amount / info.totalSupply!) * 100 < WHALE_MOVE_SUPPLY_CEILING_PERCENT);
              const biggest = eligible.reduce<(typeof transfers)[number] | null>(
                (max, t) => (!max || t.amount > max.amount ? t : max),
                null,
              );
              const percentOfSupply = biggest ? (biggest.amount / info.totalSupply) * 100 : 0;
              if (biggest && percentOfSupply >= WHALE_MOVE_SUPPLY_THRESHOLD_PERCENT) {
                recentWhaleMove = {
                  fromAddress: biggest.from,
                  toAddress: biggest.to,
                  percentOfSupply,
                  amount: biggest.amount,
                  timestamp: biggest.timestamp,
                };
              }
            }

            return { address, transfers, recentWhaleMove, source: "tronscan", live: true, updatedAt: Date.now() };
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

  app.get<{ Params: { address: string } }>(
    "/api/meme/token/:address/creator-history",
    async (request, reply) => {
      const { address } = request.params;
      try {
        const result = await cache.wrap<MemeCreatorHistoryResponse>(
          `meme:creator-history:${address}`,
          TTL.memeCreatorHistory,
          async () => {
            const detail = await fetchSunPumpTokenDetail(address).catch(() => null);
            const creatorAddress = detail?.ownerAddress ?? null;
            const otherTokens = creatorAddress ? await fetchCreatorTokenHistory(creatorAddress, address) : [];
            return {
              tokenAddress: address,
              creatorAddress,
              otherTokens,
              scannedTransactions: creatorAddress ? 30 : 0,
              isEstimate: true as const,
              updatedAt: Date.now(),
            };
          },
        );
        return reply.send(result);
      } catch (err) {
        request.log.error({ err, address }, "meme/token/creator-history failed");
        return reply.status(502).send({ error: "meme creator history unavailable" });
      }
    },
  );
}
