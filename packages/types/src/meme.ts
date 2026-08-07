import { z } from "zod";

export const MemeTokenStatusSchema = z.enum(["bonding-curve", "graduated"]);
export type MemeTokenStatus = z.infer<typeof MemeTokenStatusSchema>;

export const RecentTokenCreationSchema = z.object({
  address: z.string(),
  txId: z.string(),
  createdAt: z.number(), // unix ms
  imageUrl: z.string().nullable(),
});
export type RecentTokenCreation = z.infer<typeof RecentTokenCreationSchema>;

export const RecentTokenCreationsResponseSchema = z.object({
  tokens: z.array(RecentTokenCreationSchema),
  source: z.string(),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type RecentTokenCreationsResponse = z.infer<typeof RecentTokenCreationsResponseSchema>;

export const MemeTokenSummarySchema = z.object({
  address: z.string(),
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  decimals: z.number().nullable(),
  totalSupply: z.number().nullable(),
  holdersCount: z.number().nullable(),
  status: MemeTokenStatusSchema,
  priceUsd: z.number().nullable(),
  liquidityUsd: z.number().nullable(),
  volume24hUsd: z.number().nullable(),
  marketCapUsd: z.number().nullable(),
  dexUrl: z.string().nullable(),
  /** Real image submitted to DexScreener, when the token has a profile there — null for most brand-new tokens (never fabricated as a placeholder here; the frontend generates its own identicon in that case). */
  imageUrl: z.string().nullable(),
  /** SunPump's own bonding-curve progress (0-100), straight from their API — null once graduated (the field stops being meaningful post-graduation). */
  pumpPercentage: z.number().nullable(),
  /** The wallet that called createAndInitPurchase for this token, per SunPump's own API. */
  creatorAddress: z.string().nullable(),
  /** Set when the token's name/symbol closely matches a well-known asset (USDT, BTC, ETH, ...) — a common impersonation-scam pattern on launchpads. Null when no match. */
  nameSimilarityWarning: z.string().nullable(),
  source: z.string(),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type MemeTokenSummary = z.infer<typeof MemeTokenSummarySchema>;

export const MemeHolderSchema = z.object({
  address: z.string(),
  balance: z.number(),
  percentage: z.number().nullable(),
});
export type MemeHolder = z.infer<typeof MemeHolderSchema>;

export const MemeTransferSchema = z.object({
  from: z.string(),
  to: z.string(),
  amount: z.number(),
  timestamp: z.number(),
});
export type MemeTransfer = z.infer<typeof MemeTransferSchema>;

export const MemeWhaleMoveSchema = z.object({
  fromAddress: z.string(),
  toAddress: z.string(),
  percentOfSupply: z.number(),
  amount: z.number(),
  timestamp: z.number(),
});
export type MemeWhaleMove = z.infer<typeof MemeWhaleMoveSchema>;

export const MemeTransfersResponseSchema = z.object({
  address: z.string(),
  transfers: z.array(MemeTransferSchema),
  /** The largest single transfer in the fetched window, when it moved a notable share of supply
   * (>=3%) — a possible whale dump/repositioning, not necessarily malicious. Null when nothing
   * in the window crossed that bar. */
  recentWhaleMove: MemeWhaleMoveSchema.nullable(),
  source: z.string(),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type MemeTransfersResponse = z.infer<typeof MemeTransfersResponseSchema>;

export const MemeConcentrationRiskSchema = z.enum(["bajo", "medio", "alto"]);
export type MemeConcentrationRisk = z.infer<typeof MemeConcentrationRiskSchema>;

export const MemeHoldersResponseSchema = z.object({
  address: z.string(),
  totalSupply: z.number().nullable(),
  holders: z.array(MemeHolderSchema),
  /** % of supply still sitting in SunPump's own bonding-curve reserve (unsold), when detected — excluded from `holders` since it isn't a buyer. */
  unsoldReservePercent: z.number().nullable(),
  /** % of circulating (non-reserve) supply held by the top 10 wallets — the most-cited rug-pull
   * heuristic. Null when totalSupply is unknown. */
  top10ConcentrationPercent: z.number().nullable(),
  /** bajo <30%, medio 30-50%, alto >50% — thresholds documented in the provider, always shown
   * alongside the raw percentage, never as a bare label. */
  concentrationRisk: MemeConcentrationRiskSchema.nullable(),
  source: z.string(),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type MemeHoldersResponse = z.infer<typeof MemeHoldersResponseSchema>;

export const ClusterGroupSchema = z.object({
  fundingSource: z.string(),
  memberAddresses: z.array(z.string()),
  combinedBalance: z.number(),
});
export type ClusterGroup = z.infer<typeof ClusterGroupSchema>;

export const MemeActivityTypeSchema = z.enum(["buy", "sell"]);
export type MemeActivityType = z.infer<typeof MemeActivityTypeSchema>;

export const MemeActivityEventSchema = z.object({
  type: MemeActivityTypeSchema,
  tokenAddress: z.string(),
  symbol: z.string().nullable(),
  imageUrl: z.string().nullable(),
  trxAmount: z.number().nullable(),
  walletAddress: z.string(),
  txId: z.string(),
  timestamp: z.number(),
});
export type MemeActivityEvent = z.infer<typeof MemeActivityEventSchema>;

export const MemeActivityResponseSchema = z.object({
  events: z.array(MemeActivityEventSchema),
  source: z.string(),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type MemeActivityResponse = z.infer<typeof MemeActivityResponseSchema>;

export const MemeCreatorTokenSchema = z.object({
  address: z.string(),
  symbol: z.string().nullable(),
  name: z.string().nullable(),
  /** "CREATED" = still on the bonding curve, "LAUNCHED" = graduated to SunSwap. */
  status: z.string().nullable(),
  holders: z.number().nullable(),
  pumpPercentage: z.number().nullable(),
});
export type MemeCreatorToken = z.infer<typeof MemeCreatorTokenSchema>;

export const MemeCreatorHistoryResponseSchema = z.object({
  tokenAddress: z.string(),
  creatorAddress: z.string().nullable(),
  otherTokens: z.array(MemeCreatorTokenSchema),
  /** How many of the creator's recent transactions were scanned to find `otherTokens` — a
   * bounded window (not their full history), so this is a lower bound on their real activity,
   * never presented as a complete list. */
  scannedTransactions: z.number(),
  isEstimate: z.literal(true),
  updatedAt: z.number(),
});
export type MemeCreatorHistoryResponse = z.infer<typeof MemeCreatorHistoryResponseSchema>;

export const MemeClusteringResponseSchema = z.object({
  address: z.string(),
  analyzedHolders: z.number(),
  groups: z.array(ClusterGroupSchema),
  isEstimate: z.literal(true),
  updatedAt: z.number(),
});
export type MemeClusteringResponse = z.infer<typeof MemeClusteringResponseSchema>;
