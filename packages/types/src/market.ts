import { z } from "zod";

export const TIMEFRAMES = [
  "1m",
  "3m",
  "5m",
  "15m",
  "1h",
  "2h",
  "4h",
  "1d",
  "1w",
  "1M",
] as const;

export const TimeframeSchema = z.enum(TIMEFRAMES);
export type Timeframe = z.infer<typeof TimeframeSchema>;

export const ASSETS = ["BTC", "TRX"] as const;
export const AssetSchema = z.enum(ASSETS);
export type Asset = z.infer<typeof AssetSchema>;

export const KlineSourceSchema = z.enum([
  "binance",
  "bybit",
  "cryptocompare",
  "coingecko",
]);
export type KlineSource = z.infer<typeof KlineSourceSchema>;

export const CandleSchema = z.object({
  time: z.number().int(), // unix seconds
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});
export type Candle = z.infer<typeof CandleSchema>;

export const KlinesResponseSchema = z.object({
  symbol: z.string(),
  interval: TimeframeSchema,
  source: KlineSourceSchema,
  candles: z.array(CandleSchema),
});
export type KlinesResponse = z.infer<typeof KlinesResponseSchema>;

export const CoinMarketDataSchema = z.object({
  id: z.string(),
  symbol: AssetSchema,
  price: z.number(),
  marketCap: z.number(),
  ath: z.number(),
  athChangePercent: z.number(),
  change1h: z.number().nullable(),
  change24h: z.number().nullable(),
  change7d: z.number().nullable(),
  change30d: z.number().nullable(),
  change1y: z.number().nullable(),
  updatedAt: z.number(),
});
export type CoinMarketData = z.infer<typeof CoinMarketDataSchema>;

export const MarketCoinsResponseSchema = z.object({
  coins: z.array(CoinMarketDataSchema),
  source: z.literal("coingecko"),
});
export type MarketCoinsResponse = z.infer<typeof MarketCoinsResponseSchema>;

export const PricePointSchema = z.object({
  time: z.number().int(),
  price: z.number(),
});
export type PricePoint = z.infer<typeof PricePointSchema>;

export const MarketHistoryResponseSchema = z.object({
  asset: AssetSchema,
  days: z.number().int(),
  points: z.array(PricePointSchema),
  source: z.enum(["coingecko", "cryptocompare"]),
});
export type MarketHistoryResponse = z.infer<typeof MarketHistoryResponseSchema>;

export const FearGreedClassificationSchema = z.enum([
  "extreme_fear",
  "fear",
  "neutral",
  "greed",
  "extreme_greed",
]);
export type FearGreedClassification = z.infer<typeof FearGreedClassificationSchema>;

export const FearGreedResponseSchema = z.object({
  value: z.number().min(0).max(100),
  classification: FearGreedClassificationSchema,
  updatedAt: z.number(),
  source: z.literal("alternative.me"),
});
export type FearGreedResponse = z.infer<typeof FearGreedResponseSchema>;

export const FearGreedHistoryPointSchema = z.object({
  value: z.number().min(0).max(100),
  classification: FearGreedClassificationSchema,
  time: z.number().int(),
});
export type FearGreedHistoryPoint = z.infer<typeof FearGreedHistoryPointSchema>;

export const FearGreedHistoryResponseSchema = z.object({
  points: z.array(FearGreedHistoryPointSchema),
  source: z.literal("alternative.me"),
});
export type FearGreedHistoryResponse = z.infer<typeof FearGreedHistoryResponseSchema>;

export const M2PointSchema = z.object({
  time: z.number().int(),
  m2: z.number(),
  btcPrice: z.number().nullable(),
  trxPrice: z.number().nullable(),
});
export type M2Point = z.infer<typeof M2PointSchema>;

export const M2ResponseSchema = z.object({
  points: z.array(M2PointSchema),
  source: z.enum(["fred", "static-fallback"]),
  live: z.boolean(),
});
export type M2Response = z.infer<typeof M2ResponseSchema>;

export const StablecoinSymbolSchema = z.enum(["USDT", "USDC", "USDD", "TUSD", "USDJ"]);
export type StablecoinSymbol = z.infer<typeof StablecoinSymbolSchema>;

export const StablecoinDataSchema = z.object({
  symbol: StablecoinSymbolSchema,
  supply: z.number(),
  holders: z.number().nullable(),
});
export type StablecoinData = z.infer<typeof StablecoinDataSchema>;

export const StablecoinsResponseSchema = z.object({
  stablecoins: z.array(StablecoinDataSchema),
  totalSupply: z.number(),
  source: z.enum(["tronscan", "coingecko", "static-fallback"]),
  live: z.boolean(),
});
export type StablecoinsResponse = z.infer<typeof StablecoinsResponseSchema>;

export const TronStatsResponseSchema = z.object({
  totalAccounts: z.number().nullable(),
  totalTransactions: z.number().nullable(),
  tps: z.number().nullable(),
  tvl: z.number().nullable(),
  totalNodes: z.number().nullable(),
  totalContracts: z.number().nullable(),
  usdtSupply: z.number().nullable(),
  blockHeight: z.number().nullable(),
  source: z.enum(["tronscan", "tronscan-nokey", "trongrid", "static-fallback"]),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type TronStatsResponse = z.infer<typeof TronStatsResponseSchema>;

export const BitcoinStatsResponseSchema = z.object({
  blockHeight: z.number(),
  hashrateEhs: z.number(),
  difficulty: z.number(),
  fees: z.object({
    fastestFee: z.number(),
    halfHourFee: z.number(),
    hourFee: z.number(),
    economyFee: z.number(),
  }),
  mempool: z.object({
    count: z.number(),
    vsizeMB: z.number(),
    totalFeesBtc: z.number(),
  }),
  difficultyAdjustment: z.object({
    progressPercent: z.number(),
    difficultyChangePercent: z.number(),
    estimatedRetargetDate: z.number(),
    remainingBlocks: z.number(),
  }),
  source: z.literal("mempool.space"),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type BitcoinStatsResponse = z.infer<typeof BitcoinStatsResponseSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  uptime: z.number(),
  timestamp: z.number(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const TokenSearchResultSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  thumb: z.string(),
  marketCapRank: z.number().nullable(),
});
export type TokenSearchResult = z.infer<typeof TokenSearchResultSchema>;

export const TokenSearchResponseSchema = z.object({
  results: z.array(TokenSearchResultSchema),
});
export type TokenSearchResponse = z.infer<typeof TokenSearchResponseSchema>;
