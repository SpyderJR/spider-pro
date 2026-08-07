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

export const MemeTransfersResponseSchema = z.object({
  address: z.string(),
  transfers: z.array(MemeTransferSchema),
  source: z.string(),
  live: z.boolean(),
  updatedAt: z.number(),
});
export type MemeTransfersResponse = z.infer<typeof MemeTransfersResponseSchema>;

export const MemeHoldersResponseSchema = z.object({
  address: z.string(),
  totalSupply: z.number().nullable(),
  holders: z.array(MemeHolderSchema),
  /** % of supply still sitting in SunPump's own bonding-curve reserve (unsold), when detected — excluded from `holders` since it isn't a buyer. */
  unsoldReservePercent: z.number().nullable(),
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

export const MemeClusteringResponseSchema = z.object({
  address: z.string(),
  analyzedHolders: z.number(),
  groups: z.array(ClusterGroupSchema),
  isEstimate: z.literal(true),
  updatedAt: z.number(),
});
export type MemeClusteringResponse = z.infer<typeof MemeClusteringResponseSchema>;
