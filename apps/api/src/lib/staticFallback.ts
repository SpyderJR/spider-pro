import type { BitcoinStatsResponse, M2Point, StablecoinData, TronStatsResponse } from "@spider/types";

/** Reference snapshot used only if TronScan and TronGrid both fail — keeps the TRON section from rendering empty. */
export const TRON_STATIC_FALLBACK: Omit<TronStatsResponse, "source" | "live" | "updatedAt"> = {
  totalAccounts: 249_000_000,
  totalTransactions: 9_100_000_000,
  tps: 62,
  tvl: 5_800_000_000,
  totalNodes: 1_500,
  totalContracts: 6_900_000,
  usdtSupply: 58_000_000_000,
  blockHeight: null,
};

export const STABLECOIN_STATIC_FALLBACK: StablecoinData[] = [
  { symbol: "USDT", supply: 58_000_000_000, holders: null },
  { symbol: "USDC", supply: 3_000_000_000, holders: null },
  { symbol: "USDD", supply: 340_000_000, holders: null },
  { symbol: "TUSD", supply: 150_000_000, holders: null },
  { symbol: "USDJ", supply: 60_000_000, holders: null },
];

/** Reference snapshot used only if mempool.space is unreachable — keeps the Bitcoin on-chain section from rendering empty. */
export const BITCOIN_STATIC_FALLBACK: Omit<BitcoinStatsResponse, "source" | "live" | "updatedAt"> = {
  blockHeight: 870_000,
  hashrateEhs: 700,
  difficulty: 100_000_000_000_000,
  fees: { fastestFee: 5, halfHourFee: 3, hourFee: 2, economyFee: 1 },
  mempool: { count: 5_000, vsizeMB: 5, totalFeesBtc: 0.5 },
  difficultyAdjustment: { progressPercent: 50, difficultyChangePercent: 0, estimatedRetargetDate: Date.now(), remainingBlocks: 1000 },
};

/** Static M2SL reference points (billions USD, monthly) used only if FRED is unreachable. */
export const M2_STATIC_FALLBACK: M2Point[] = [
  { time: Date.parse("2023-01-01") / 1000, m2: 21200, btcPrice: null, trxPrice: null },
  { time: Date.parse("2023-07-01") / 1000, m2: 20900, btcPrice: null, trxPrice: null },
  { time: Date.parse("2024-01-01") / 1000, m2: 20800, btcPrice: null, trxPrice: null },
  { time: Date.parse("2024-07-01") / 1000, m2: 21000, btcPrice: null, trxPrice: null },
  { time: Date.parse("2025-01-01") / 1000, m2: 21500, btcPrice: null, trxPrice: null },
];
