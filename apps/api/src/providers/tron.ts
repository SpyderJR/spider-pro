import type { StablecoinSymbol } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

export interface TronScanStats {
  totalAccounts: number | null;
  totalTransactions: number | null;
  tps: number | null;
  tvl: number | null;
  totalNodes: number | null;
  totalContracts: number | null;
  usdtSupply: number | null;
  blockHeight: number | null;
}

interface TronScanHomepageBundleResponse {
  tps?: { data?: { nodeNum?: number; blockHeight?: number; currentTps?: number } };
  node?: { total?: number };
  statsOverview?: {
    data?: Array<{
      dateDayStr?: string;
      totalTransaction?: number;
      totalAddress?: number;
      accountWithTrx?: number;
      totalTrc20?: number;
    }>;
  };
}

function tronScanHeaders(): Record<string, string> {
  return env.TRONSCAN_API_KEY ? { "TRON-PRO-API-KEY": env.TRONSCAN_API_KEY } : {};
}

/**
 * Attempt 1: TronScan with API key. Attempt 2: TronScan without key (public,
 * rate-limited). Sources live network-wide stats from the same aggregate
 * bundle the tronscan.org homepage itself renders from.
 */
export async function fetchTronScanStats(useKey: boolean): Promise<TronScanStats> {
  const headers = useKey ? tronScanHeaders() : {};
  const url = `${env.TRONSCAN_BASE_URL}/api/system/homepage-bundle`;
  const raw = await fetchJson<TronScanHomepageBundleResponse>("tronscan", url, { headers });

  const latest = raw.statsOverview?.data?.at(-1);

  return {
    totalAccounts: latest?.accountWithTrx ?? latest?.totalAddress ?? null,
    totalTransactions: latest?.totalTransaction ?? null,
    tps: raw.tps?.data?.currentTps ?? null,
    tvl: null,
    totalNodes: raw.node?.total ?? raw.tps?.data?.nodeNum ?? null,
    totalContracts: latest?.totalTrc20 ?? null,
    usdtSupply: null,
    blockHeight: raw.tps?.data?.blockHeight ?? null,
  };
}

interface TronGridBlockResponse {
  block_header: { raw_data: { number: number } };
}

/**
 * Attempt 3: TronGrid — only gives us block height, used as a last-resort partial signal.
 * TronGrid issues its own API keys separate from TronScan's; a TronScan key sent here gets
 * rejected with 401 rather than ignored, so this deliberately calls the public endpoint unkeyed.
 */
export async function fetchTronGridBlockHeight(): Promise<number> {
  const url = `${env.TRONGRID_BASE_URL}/wallet/getnowblock`;
  const raw = await fetchJson<TronGridBlockResponse>("trongrid", url);
  return raw.block_header.raw_data.number;
}

interface TronScanTrc20Response {
  trc20_tokens?: Array<{ symbol: string; total_supply_with_decimals: string; decimals: number }>;
}

const TRC20_CONTRACT: Record<StablecoinSymbol, string> = {
  USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  USDC: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
  USDD: "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
  TUSD: "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4",
  USDJ: "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
};

export async function fetchTronStablecoinSupply(
  symbol: StablecoinSymbol,
): Promise<{ supply: number; holders: number | null } | null> {
  const contract = TRC20_CONTRACT[symbol];
  const url = `${env.TRONSCAN_BASE_URL}/api/token_trc20?contract=${contract}&showAll=1`;
  try {
    const raw = await fetchJson<{
      trc20_tokens?: Array<{
        total_supply_with_decimals?: string;
        decimals?: number;
        holders_count?: number;
      }>;
    }>("tronscan", url, { headers: tronScanHeaders() });
    const token = raw.trc20_tokens?.[0];
    if (!token?.total_supply_with_decimals) return null;
    const decimals = token.decimals ?? 6;
    const supply = Number(token.total_supply_with_decimals) / 10 ** decimals;
    return { supply, holders: token.holders_count ?? null };
  } catch {
    return null;
  }
}
