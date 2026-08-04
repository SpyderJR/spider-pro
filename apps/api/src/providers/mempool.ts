import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

export interface MempoolFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
}

export interface MempoolStats {
  count: number;
  vsizeMB: number;
  totalFeesBtc: number;
}

export interface DifficultyAdjustment {
  progressPercent: number;
  difficultyChangePercent: number;
  estimatedRetargetDate: number;
  remainingBlocks: number;
}

export interface BitcoinOnChainStats {
  blockHeight: number;
  hashrateEhs: number;
  difficulty: number;
  fees: MempoolFees;
  mempool: MempoolStats;
  difficultyAdjustment: DifficultyAdjustment;
}

/** mempool.space — API pública, gratuita, sin key. */
export async function fetchBitcoinOnChainStats(): Promise<BitcoinOnChainStats> {
  const base = env.MEMPOOL_BASE_URL;

  const [blockHeight, fees, mempool, difficultyAdjustment, hashrate] = await Promise.all([
    fetchJson<number>("mempool", `${base}/api/blocks/tip/height`),
    fetchJson<MempoolFees & { minimumFee: number }>("mempool", `${base}/api/v1/fees/recommended`),
    fetchJson<{ count: number; vsize: number; total_fee: number }>("mempool", `${base}/api/mempool`),
    fetchJson<{
      progressPercent: number;
      difficultyChange: number;
      estimatedRetargetDate: number;
      remainingBlocks: number;
    }>("mempool", `${base}/api/v1/difficulty-adjustment`),
    fetchJson<{ currentHashrate: number; currentDifficulty: number }>(
      "mempool",
      `${base}/api/v1/mining/hashrate/3d`,
    ),
  ]);

  return {
    blockHeight,
    hashrateEhs: hashrate.currentHashrate / 1e18,
    difficulty: hashrate.currentDifficulty,
    fees: {
      fastestFee: fees.fastestFee,
      halfHourFee: fees.halfHourFee,
      hourFee: fees.hourFee,
      economyFee: fees.economyFee,
    },
    mempool: {
      count: mempool.count,
      vsizeMB: mempool.vsize / 1_000_000,
      totalFeesBtc: mempool.total_fee / 1e8,
    },
    difficultyAdjustment: {
      progressPercent: difficultyAdjustment.progressPercent,
      difficultyChangePercent: difficultyAdjustment.difficultyChange,
      estimatedRetargetDate: difficultyAdjustment.estimatedRetargetDate,
      remainingBlocks: difficultyAdjustment.remainingBlocks,
    },
  };
}
