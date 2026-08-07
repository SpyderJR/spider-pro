import { z } from "zod";

export const WhaleCategorySchema = z.enum(["exchange", "institution", "political", "founder", "historical"]);
export type WhaleCategory = z.infer<typeof WhaleCategorySchema>;

export const WhaleChainSchema = z.enum(["BTC", "ETH", "TRON", "SOL"]);
export type WhaleChain = z.infer<typeof WhaleChainSchema>;

/** How confidently the address(es) behind this entity are attributed — shown in the UI so
 * nobody mistakes "widely reported by press" for "the entity confirmed it themselves". Never
 * silently upgraded — see apps/api/src/data/whaleEntities.ts for the sourcing behind each one. */
export const WhaleConfidenceSchema = z.enum(["verified", "widely-reported", "declared"]);
export type WhaleConfidence = z.infer<typeof WhaleConfidenceSchema>;

export const WhaleTokenBalanceSchema = z.object({
  symbol: z.string(),
  amount: z.number(),
  usdValue: z.number().nullable(),
});
export type WhaleTokenBalance = z.infer<typeof WhaleTokenBalanceSchema>;

export const WhaleChainBalanceSchema = z.object({
  chain: WhaleChainSchema,
  address: z.string(),
  nativeSymbol: z.string(),
  nativeAmount: z.number().nullable(),
  nativeUsdValue: z.number().nullable(),
  tokens: z.array(WhaleTokenBalanceSchema),
  /** native + tracked tokens on this chain — null if the on-chain read failed. */
  usdValue: z.number().nullable(),
});
export type WhaleChainBalance = z.infer<typeof WhaleChainBalanceSchema>;

export const WhaleEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: WhaleCategorySchema,
  avatarEmoji: z.string(),
  avatarColor: z.string(),
  tags: z.array(z.string()),
  /** "onchain" = balances read live from real addresses. "declared" = no single verifiable
   * on-chain address exists (e.g. institutional custody); figure comes from the entity's own
   * public disclosure instead, shown with a different badge in the UI. */
  dataMode: z.enum(["onchain", "declared"]),
  confidence: WhaleConfidenceSchema,
  chains: z.array(WhaleChainSchema),
  totalUsdValue: z.number().nullable(),
  declaredNote: z.string().nullable(),
  /** When outside estimates of this entity's REAL total wealth are dramatically higher than what
   * we can verify on-chain (common for individuals — most of their net worth sits in unconfirmed
   * wallets or non-crypto equity), a short cited note explaining the gap — never our own number,
   * always attributed to whoever published it. Null when our tracked total is already realistic. */
  externalEstimateNote: z.string().nullable(),
  sourceUrl: z.string(),
  sourceNote: z.string(),
  updatedAt: z.number(),
  live: z.boolean(),
});
export type WhaleEntity = z.infer<typeof WhaleEntitySchema>;

export const WhaleListResponseSchema = z.object({
  entities: z.array(WhaleEntitySchema),
  updatedAt: z.number(),
});
export type WhaleListResponse = z.infer<typeof WhaleListResponseSchema>;

export const WhaleDetailSchema = WhaleEntitySchema.extend({
  balances: z.array(WhaleChainBalanceSchema),
});
export type WhaleDetail = z.infer<typeof WhaleDetailSchema>;

export const WhaleDetailResponseSchema = z.object({
  entity: WhaleDetailSchema,
});
export type WhaleDetailResponse = z.infer<typeof WhaleDetailResponseSchema>;
