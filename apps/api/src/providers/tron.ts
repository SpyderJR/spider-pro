import type { StablecoinSymbol } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

function tronGridHeaders(): Record<string, string> {
  return env.TRONGRID_API_KEY ? { "TRON-PRO-API-KEY": env.TRONGRID_API_KEY } : {};
}

interface TronGridAccountResponse {
  data?: Array<{ balance?: number; trc20?: Array<Record<string, string>> }>;
}

export interface TronAccountBalance {
  trxBalance: number;
  /** contract address (base58, "T..." form) → token amount, already decimal-adjusted using the
   * decimals passed alongside each requested contract. */
  trc20: Map<string, number>;
}

/**
 * Native TRX + TRC20 balances for a wallet, in one call — TronGrid's account endpoint returns
 * both together, so there's no need for a separate per-token lookup like on Ethereum. Used by
 * the Whale Watcher for TRON-based entities (e.g. Tether Treasury).
 */
export async function fetchTronAccountBalance(
  address: string,
  trc20Contracts: Array<{ contract: string; decimals: number }>,
): Promise<TronAccountBalance> {
  const url = `${env.TRONGRID_BASE_URL}/v1/accounts/${address}`;
  const raw = await fetchJson<TronGridAccountResponse>("trongrid", url, { headers: tronGridHeaders() });
  const account = raw.data?.[0];

  const decimalsByContract = new Map(trc20Contracts.map((t) => [t.contract, t.decimals]));
  const trc20 = new Map<string, number>();
  for (const entry of account?.trc20 ?? []) {
    for (const [contract, rawAmount] of Object.entries(entry)) {
      const decimals = decimalsByContract.get(contract);
      if (decimals === undefined) continue;
      trc20.set(contract, Number(rawAmount) / 10 ** decimals);
    }
  }

  return { trxBalance: (account?.balance ?? 0) / 1e6, trc20 };
}

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

export function tronScanHeaders(): Record<string, string> {
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

// Verified directly against CoinGecko's authoritative per-chain contract listing (2026-08-04)
// after a user report of wrong TRON supply numbers — the old USDD address below turned out to
// be a deprecated/abandoned contract (TronScan itself labels it "USDDOLD"): it still returns
// valid-looking data, just for a token nobody uses anymore (~$7M supply vs. the real ~$1.28B).
// Never trust a contract address here without cross-checking it against a second source first.
const TRC20_CONTRACT: Record<StablecoinSymbol, string> = {
  USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  USDC: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
  USDD: "TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz",
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
