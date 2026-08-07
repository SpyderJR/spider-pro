import type { WhaleChain, WhaleChainBalance, WhaleDetail, WhaleEntity } from "@spider/types";
import { cache } from "../lib/cache.js";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";
import { fetchEthBalance, fetchErc20Balance } from "../lib/ethRpc.js";
import { fetchSolBalance } from "../lib/solanaRpc.js";
import { fetchTronAccountBalance } from "./tron.js";
import { WHALE_ENTITIES, type WhaleAddressConfig, type WhaleEntityConfig } from "../data/whaleEntities.js";

const COINGECKO_PRICE_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  TRX: "tron",
  SOL: "solana",
  WLFI: "world-liberty-financial",
};
const STABLECOIN_SYMBOLS = new Set(["USDT", "USDC"]);

/** Strategy's (MicroStrategy) self-disclosed total BTC position — they publish no on-chain
 * address, so this is a fixed figure sourced from their own investor-relations page rather than
 * a live read. Update this constant (with a new date) whenever they announce a new purchase;
 * showing a stale-but-labeled figure is honest, silently pretending it's live would not be. */
const STRATEGY_BTC_HOLDINGS = { amount: 843_775, asOf: "2026-07-26", source: "https://www.strategy.com/purchases" };

async function fetchPrices(): Promise<Record<string, number>> {
  return cache.wrap("whale:prices", 60_000, async () => {
    const ids = Object.values(COINGECKO_PRICE_ID).join(",");
    const url = `${env.COINGECKO_BASE_URL}/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const raw = await fetchJson<Record<string, { usd: number }>>("coingecko", url);
    const bySymbol: Record<string, number> = {};
    for (const [symbol, id] of Object.entries(COINGECKO_PRICE_ID)) {
      if (raw[id]) bySymbol[symbol] = raw[id].usd;
    }
    return bySymbol;
  });
}

function priceFor(symbol: string, prices: Record<string, number>): number | null {
  if (STABLECOIN_SYMBOLS.has(symbol)) return 1;
  return prices[symbol] ?? null;
}

async function fetchAddressBalance(addr: WhaleAddressConfig, prices: Record<string, number>): Promise<WhaleChainBalance> {
  const fallback: WhaleChainBalance = {
    chain: addr.chain,
    address: addr.address,
    nativeSymbol: addr.nativeSymbol,
    nativeAmount: null,
    nativeUsdValue: null,
    tokens: [],
    usdValue: null,
  };

  try {
    if (addr.chain === "BTC") {
      const url = `${env.MEMPOOL_BASE_URL}/api/address/${addr.address}`;
      const raw = await fetchJson<{ chain_stats: { funded_txo_sum: number; spent_txo_sum: number } }>("mempool", url);
      const amount = (raw.chain_stats.funded_txo_sum - raw.chain_stats.spent_txo_sum) / 1e8;
      const price = priceFor("BTC", prices);
      const usdValue = price !== null ? amount * price : null;
      return { ...fallback, nativeAmount: amount, nativeUsdValue: usdValue, usdValue };
    }

    if (addr.chain === "ETH") {
      const nativeAmount = await fetchEthBalance(addr.address);
      const nativePrice = priceFor("ETH", prices);
      const nativeUsdValue = nativePrice !== null ? nativeAmount * nativePrice : null;

      const tokens = await Promise.all(
        (addr.tokens ?? []).map(async (t) => {
          try {
            const amount = await fetchErc20Balance(addr.address, t.contract);
            const price = priceFor(t.symbol, prices);
            return { symbol: t.symbol, amount, usdValue: price !== null ? amount * price : null };
          } catch {
            return { symbol: t.symbol, amount: 0, usdValue: null };
          }
        }),
      );
      const tokensUsd = tokens.reduce((sum, t) => sum + (t.usdValue ?? 0), 0);
      const usdValue = nativeUsdValue !== null ? nativeUsdValue + tokensUsd : null;
      return { ...fallback, nativeAmount, nativeUsdValue, tokens, usdValue };
    }

    if (addr.chain === "SOL") {
      const nativeAmount = await fetchSolBalance(addr.address);
      const price = priceFor("SOL", prices);
      const usdValue = price !== null ? nativeAmount * price : null;
      return { ...fallback, nativeAmount, nativeUsdValue: usdValue, usdValue };
    }

    // TRON — one call returns native TRX + every requested TRC20 balance together.
    const trc20Contracts = (addr.tokens ?? []).map((t) => ({ contract: t.contract, decimals: t.decimals ?? 6 }));
    const account = await fetchTronAccountBalance(addr.address, trc20Contracts);
    const nativePrice = priceFor("TRX", prices);
    const nativeUsdValue = nativePrice !== null ? account.trxBalance * nativePrice : null;
    const tokens = (addr.tokens ?? []).map((t) => {
      const amount = account.trc20.get(t.contract) ?? 0;
      const price = priceFor(t.symbol, prices);
      return { symbol: t.symbol, amount, usdValue: price !== null ? amount * price : null };
    });
    const tokensUsd = tokens.reduce((sum, t) => sum + (t.usdValue ?? 0), 0);
    const usdValue = nativeUsdValue !== null ? nativeUsdValue + tokensUsd : null;
    return { ...fallback, nativeAmount: account.trxBalance, nativeUsdValue, tokens, usdValue };
  } catch {
    return fallback;
  }
}

function declaredEntity(config: WhaleEntityConfig, totalUsdValue: number | null, updatedAt: number): WhaleEntity {
  return {
    id: config.id,
    name: config.name,
    category: config.category,
    avatarEmoji: config.avatarEmoji,
    avatarColor: config.avatarColor,
    tags: config.tags,
    dataMode: config.dataMode,
    confidence: config.confidence,
    chains: config.addresses.map((a) => a.chain),
    totalUsdValue,
    declaredNote: config.declaredNote ?? null,
    sourceUrl: config.sourceUrl,
    sourceNote: config.sourceNote,
    updatedAt,
    live: false,
  };
}

async function computeOnchainEntity(config: WhaleEntityConfig, prices: Record<string, number>): Promise<WhaleDetail> {
  const balances = await Promise.all(config.addresses.map((addr) => fetchAddressBalance(addr, prices)));
  const totalUsdValue = balances.some((b) => b.usdValue !== null)
    ? balances.reduce((sum, b) => sum + (b.usdValue ?? 0), 0)
    : null;
  const live = balances.every((b) => b.nativeAmount !== null);
  const updatedAt = Date.now();

  return {
    id: config.id,
    name: config.name,
    category: config.category,
    avatarEmoji: config.avatarEmoji,
    avatarColor: config.avatarColor,
    tags: config.tags,
    dataMode: config.dataMode,
    confidence: config.confidence,
    chains: config.addresses.map((a) => a.chain),
    totalUsdValue,
    declaredNote: config.declaredNote ?? null,
    sourceUrl: config.sourceUrl,
    sourceNote: config.sourceNote,
    updatedAt,
    live,
    balances,
  };
}

function computeDeclaredEntity(config: WhaleEntityConfig, prices: Record<string, number>): WhaleDetail {
  const updatedAt = Date.now();
  let totalUsdValue: number | null = null;

  if (config.id === "strategy-mstr") {
    const btcPrice = priceFor("BTC", prices);
    totalUsdValue = btcPrice !== null ? STRATEGY_BTC_HOLDINGS.amount * btcPrice : null;
  }

  return {
    ...declaredEntity(config, totalUsdValue, updatedAt),
    balances: [],
  };
}

async function computeEntityDetail(config: WhaleEntityConfig, prices: Record<string, number>): Promise<WhaleDetail> {
  return config.dataMode === "declared" ? computeDeclaredEntity(config, prices) : computeOnchainEntity(config, prices);
}

export async function fetchWhaleList(): Promise<WhaleEntity[]> {
  const prices = await fetchPrices();
  const details = await Promise.all(WHALE_ENTITIES.map((config) => computeEntityDetail(config, prices)));
  return details.map(({ balances: _balances, ...summary }) => summary);
}

export async function fetchWhaleDetail(id: string): Promise<WhaleDetail | null> {
  const config = WHALE_ENTITIES.find((c) => c.id === id);
  if (!config) return null;
  const prices = await fetchPrices();
  return computeEntityDetail(config, prices);
}

export type { WhaleChain };
