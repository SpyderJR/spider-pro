import type { MemeTokenStatus } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";
import { cache } from "../lib/cache.js";
import { hexToTronAddress } from "../lib/tronAddress.js";
import { tronScanHeaders } from "./tron.js";

/**
 * SunPump's launchpad contract on TRON — verified live against TronScan during planning:
 * name "LaunchPadProxy", officially tagged "SUN" (sun.io), created 2024-08-09, 3.5M+ tx,
 * still active. SunPump does not use a dedicated pool per token — all bonding-curve activity
 * (creation, buys, sells, graduation to SunSwap) runs through this single contract.
 */
export const SUNPUMP_CONTRACT = "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw";
// Hex form (no "41" mainnet prefix) of SUNPUMP_CONTRACT — used to tell the proxy's own logs
// apart from a newly created token's logs within the same TokenCreate transaction.
const SUNPUMP_CONTRACT_HEX = "c22dd1b7bc7574e94563c8282f64b065bc07b2fa";
// Canonical keccak256("Transfer(address,address,uint256)") — the standard ERC20/TRC20 Transfer
// event topic, used to find which log in a TokenCreate transaction was emitted by the new token
// itself (its mint-to-proxy Transfer), since two *different* non-proxy contracts show up in that
// transaction's logs (the token, and a separate fee-vault contract) — verified against a real
// token creation ("Football Aliens", TJ12zFpVy9FXofXAodpFP5wFNAh78tERBi) during planning.
const TRANSFER_TOPIC = "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e";

function tronGridHeaders(): Record<string, string> {
  return env.TRONGRID_API_KEY ? { "TRON-PRO-API-KEY": env.TRONGRID_API_KEY } : {};
}

// This page fires several TronScan/TronGrid/DexScreener calls in quick succession (feed poll,
// ticker poll, token summary, holders) — under real concurrent traffic that comfortably exceeds
// the free public rate limits and produced real intermittent 502s in production (verified by
// firing a burst of concurrent requests at the live site). A couple of short retries absorbs
// those transient rate-limit blips instead of failing the whole request on the first one.
async function fetchJsonRetry<T>(provider: string, url: string, init?: RequestInit, retries = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchJson<T>(provider, url, init);
    } catch (err) {
      lastErr = err;
      // Jittered backoff — several requests failing at once (a real burst under load) would
      // otherwise all retry in lockstep and collide again on the exact same rate-limit window.
      if (attempt < retries) {
        const jitter = Math.random() * 250;
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1) + jitter));
      }
    }
  }
  throw lastErr;
}

// TronScan's public rate limit is the actual bottleneck under real concurrent traffic (a burst
// of requests retrying independently just collides with itself again). This serializes every
// TronScan call this file makes through a single queue with a fixed minimum spacing, so a burst
// drains steadily instead of stampeding — verified against the live site, this was the fix that
// actually eliminated the 502s a retry-only approach still left under load.
let tronScanQueueTail: Promise<unknown> = Promise.resolve();
const TRONSCAN_MIN_SPACING_MS = 340;

function queuedTronScanCall<T>(fn: () => Promise<T>): Promise<T> {
  const result = tronScanQueueTail.then(fn, fn);
  tronScanQueueTail = result.catch(() => undefined).then(
    () => new Promise((resolve) => setTimeout(resolve, TRONSCAN_MIN_SPACING_MS)),
  );
  return result;
}

interface TronGridEvent {
  transaction_id: string;
  event_name: string;
  block_timestamp: number;
}

interface TronGridEventsResponse {
  data?: TronGridEvent[];
}

interface TronGridTransactionInfo {
  id: string;
  blockTimeStamp?: number;
  log?: Array<{ address: string; topics?: string[]; data?: string }>;
}

async function fetchTransactionLog(txId: string): Promise<TronGridTransactionInfo> {
  const url = `${env.TRONGRID_BASE_URL}/wallet/gettransactioninfobyid`;
  return fetchJsonRetry<TronGridTransactionInfo>("trongrid", url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...tronGridHeaders() },
    body: JSON.stringify({ value: txId }),
  });
}

export interface RecentTokenCreation {
  address: string;
  txId: string;
  createdAt: number;
  imageUrl: string | null;
}

/**
 * Finds the most recent SunPump token creations by reading the contract's own `TokenCreate`
 * events, then, for each, decoding the new token's address out of that transaction's logs (see
 * TRANSFER_TOPIC above). Runs sequentially, not in parallel, to stay well within TronGrid's free
 * rate limit — matches the same discipline already used for TronScan's stablecoin calls.
 */
export async function fetchRecentTokenCreations(limit: number): Promise<RecentTokenCreation[]> {
  const eventsUrl = `${env.TRONGRID_BASE_URL}/v1/contracts/${SUNPUMP_CONTRACT}/events?event_name=TokenCreate&only_confirmed=true&limit=${limit}`;
  const eventsRaw = await fetchJsonRetry<TronGridEventsResponse>("trongrid", eventsUrl, {
    headers: tronGridHeaders(),
  });
  const events = eventsRaw.data ?? [];

  const results: RecentTokenCreation[] = [];
  for (const event of events) {
    try {
      const info = await fetchTransactionLog(event.transaction_id);
      const tokenLog = info.log?.find(
        (l) => l.topics?.[0]?.startsWith(TRANSFER_TOPIC) && l.address !== SUNPUMP_CONTRACT_HEX,
      );
      if (!tokenLog) continue;
      const tokenAddress = hexToTronAddress(tokenLog.address);
      const imageUrl = await fetchSunPumpLogo(tokenAddress).catch(() => null);
      results.push({
        address: tokenAddress,
        txId: event.transaction_id,
        createdAt: event.block_timestamp,
        imageUrl,
      });
    } catch {
      // A single tx failing to resolve shouldn't drop the whole feed — skip it.
      continue;
    }
  }
  return results;
}

interface DexScreenerPair {
  dexId: string;
  url: string;
  priceUsd?: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  fdv?: number;
  marketCap?: number;
  info?: { imageUrl?: string };
}

export interface TokenMarketData {
  status: MemeTokenStatus;
  priceUsd: number | null;
  liquidityUsd: number | null;
  volume24hUsd: number | null;
  marketCapUsd: number | null;
  dexUrl: string | null;
  /** Real image DexScreener has on file for this pair — only present for tokens that submitted a profile there (mostly established/graduated ones). Never fabricated when absent. */
  imageUrl: string | null;
}

/**
 * Resolves whether a token is still on SunPump's bonding curve or has "graduated" to a real
 * SunSwap liquidity pool, using DexScreener (free, no API key). An empty `pairs` array is the
 * clean signal for "no pool yet" — verified live: a real SunSwap pair returns full price/
 * liquidity/volume data, a token address with no pool returns `[]`.
 */
export async function fetchTokenMarketData(address: string): Promise<TokenMarketData> {
  const url = `https://api.dexscreener.com/token-pairs/v1/tron/${address}`;
  const pairs = await fetchJsonRetry<DexScreenerPair[]>("dexscreener", url);
  if (!pairs || pairs.length === 0) {
    return {
      status: "bonding-curve",
      priceUsd: null,
      liquidityUsd: null,
      volume24hUsd: null,
      marketCapUsd: null,
      dexUrl: null,
      imageUrl: null,
    };
  }
  const best = pairs.reduce((a, b) => ((b.liquidity?.usd ?? 0) > (a.liquidity?.usd ?? 0) ? b : a));
  return {
    status: "graduated",
    priceUsd: best.priceUsd ? Number(best.priceUsd) : null,
    liquidityUsd: best.liquidity?.usd ?? null,
    volume24hUsd: best.volume?.h24 ?? null,
    marketCapUsd: best.marketCap ?? best.fdv ?? null,
    dexUrl: best.url ?? null,
    imageUrl: best.info?.imageUrl ?? null,
  };
}

interface SunPumpTokenDetailResponse {
  code: number;
  data?: {
    logoUrl?: string | null;
    ownerAddress?: string | null;
    pumpPercentage?: number | null;
    status?: string | null;
    holders?: number | null;
    symbol?: string | null;
    name?: string | null;
  };
}

export interface SunPumpTokenDetail {
  logoUrl: string | null;
  /** The wallet that called createAndInitPurchase for this token — SunPump's API gives this to
   * us directly, no need to decode the creation transaction ourselves. */
  ownerAddress: string | null;
  /** Bonding-curve progress, 0-100, straight from SunPump's own calculation. */
  pumpPercentage: number | null;
  status: string | null;
  holders: number | null;
  symbol: string | null;
  name: string | null;
}

/**
 * SunPump's own public frontend API — the same unauthenticated endpoint sunpump.meme's own
 * website calls to render a token card, found by inspecting their bundled JS
 * (`token: { getToken: "token/" }`) and confirmed live against a real token (Football Aliens).
 * This has a real logo for virtually every token, including ones created seconds ago — DexScreener
 * only has images for tokens that separately submitted a profile there (mostly established
 * ones), which is why images were missing for most freshly-created tokens before this. Same
 * category of "public data the site's own frontend already exposes" as the TronScan homepage-
 * bundle endpoint already used elsewhere in this file.
 *
 * Also the cleanest source for a token's creator (`ownerAddress`) and bonding-curve progress
 * (`pumpPercentage`) — both verified live against a real, brand-new token before shipping this.
 */
export async function fetchSunPumpTokenDetail(address: string): Promise<SunPumpTokenDetail> {
  const url = `https://api-v2.sunpump.meme/pump-api/token/${address}`;
  const raw = await fetchJsonRetry<SunPumpTokenDetailResponse>("sunpump", url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const d = raw.data;
  return {
    logoUrl: d?.logoUrl ?? null,
    ownerAddress: d?.ownerAddress ?? null,
    pumpPercentage: d?.pumpPercentage ?? null,
    status: d?.status ?? null,
    holders: d?.holders ?? null,
    symbol: d?.symbol ?? null,
    name: d?.name ?? null,
  };
}

export async function fetchSunPumpLogo(address: string): Promise<string | null> {
  return fetchSunPumpTokenDetail(address).then((d) => d.logoUrl);
}

interface TronScanTrc20InfoResponse {
  trc20_tokens?: Array<{
    name?: string;
    symbol?: string;
    decimals?: number;
    total_supply_with_decimals?: string;
    holders_count?: number;
  }>;
}

export interface TokenBasicInfo {
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: number | null;
  holdersCount: number | null;
}

// Same TronScan endpoint gets hit for basic info from several call sites (token summary,
// holders' decimals lookup, activity-ticker symbol resolution) — a short cache means a burst of
// requests for the same token collapses into one real TronScan call instead of three.
export async function fetchTokenBasicInfo(address: string): Promise<TokenBasicInfo> {
  return cache.wrap(`meme:info:${address}`, 20_000, async () => {
    const url = `${env.TRONSCAN_BASE_URL}/api/token_trc20?contract=${address}&showAll=1`;
    const raw = await queuedTronScanCall(() =>
      fetchJsonRetry<TronScanTrc20InfoResponse>("tronscan", url, { headers: tronScanHeaders() }),
    );
    const token = raw.trc20_tokens?.[0];
    if (!token) {
      return { name: null, symbol: null, decimals: null, totalSupply: null, holdersCount: null };
    }
    const decimals = token.decimals ?? 18;
    const totalSupply = token.total_supply_with_decimals
      ? Number(token.total_supply_with_decimals) / 10 ** decimals
      : null;
    return {
      name: token.name ?? null,
      symbol: token.symbol ?? null,
      decimals,
      totalSupply,
      holdersCount: token.holders_count ?? null,
    };
  });
}

interface TronScanHoldersResponse {
  trc20_tokens?: Array<{ holder_address: string; balance: string }>;
}

export interface TokenHolder {
  address: string;
  balance: number;
}

// SunPump's token-creation call (`createAndInitPurchase(string,string)`) only takes a name and
// symbol — no decimals parameter — so its factory always deploys with the same fixed decimals.
// Verified against every real token sampled during planning and testing (Football Aliens, TRX
// ETF, a fake "Tether USDT" token, and others): all 18. Used as a fallback here to avoid a
// second TronScan round-trip per holders/transfers request purely to look up a value that never
// actually varies for this launchpad's tokens.
const SUNPUMP_TOKEN_DECIMALS = 18;

export async function fetchTokenHolders(address: string, limit = 50): Promise<TokenHolder[]> {
  const url = `${env.TRONSCAN_BASE_URL}/api/token_trc20/holders?contract_address=${address}&start=0&limit=${limit}`;
  const raw = await queuedTronScanCall(() =>
    fetchJsonRetry<TronScanHoldersResponse>("tronscan", url, { headers: tronScanHeaders() }),
  );
  return (raw.trc20_tokens ?? []).map((h) => ({
    address: h.holder_address,
    balance: Number(h.balance) / 10 ** SUNPUMP_TOKEN_DECIMALS,
  }));
}

interface TronScanTransfersResponse {
  token_transfers?: Array<{
    from_address: string;
    to_address: string;
    quant: string;
    block_ts: number;
    tokenInfo?: { tokenDecimal?: number };
  }>;
}

export interface TokenTransfer {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

/**
 * Recent transfers of this specific token — used to draw edges between holder bubbles when two
 * addresses already shown on the map moved this token between each other. Verified live against
 * TronScan's real response shape (`token_transfers[].from_address/to_address/quant`) — decimals
 * come from the same response's embedded `tokenInfo.tokenDecimal`, no extra call needed.
 */
export async function fetchTokenTransfers(address: string, limit = 50): Promise<TokenTransfer[]> {
  const url = `${env.TRONSCAN_BASE_URL}/api/token_trc20/transfers?limit=${limit}&start=0&contract_address=${address}`;
  const raw = await queuedTronScanCall(() =>
    fetchJsonRetry<TronScanTransfersResponse>("tronscan", url, { headers: tronScanHeaders() }),
  );
  return (raw.token_transfers ?? []).map((t) => {
    const decimals = t.tokenInfo?.tokenDecimal ?? SUNPUMP_TOKEN_DECIMALS;
    return {
      from: t.from_address,
      to: t.to_address,
      amount: Number(t.quant) / 10 ** decimals,
      timestamp: t.block_ts,
    };
  });
}

interface TronGridTransaction {
  block_timestamp: number;
  raw_data: {
    contract: Array<{
      type: string;
      parameter: { value: { owner_address?: string; to_address?: string } };
    }>;
  };
}

interface TronGridTransactionsResponse {
  data?: TronGridTransaction[];
}

/**
 * First plain TRX transfer a wallet ever received — used as a cheap proxy for "who funded this
 * wallet". Feeds the clustering heuristic (holders funded from the same source are grouped
 * together, always labeled as an estimate, never a certainty). Verified live against TronGrid's
 * real response shape (`raw_data.contract[0]`, type "TransferContract", hex-encoded owner/to
 * addresses) during planning.
 */
export async function fetchHolderFundingSource(address: string): Promise<string | null> {
  const url = `${env.TRONGRID_BASE_URL}/v1/accounts/${address}/transactions?only_confirmed=true&limit=5&order_by=block_timestamp,asc`;
  const raw = await fetchJsonRetry<TronGridTransactionsResponse>("trongrid", url, { headers: tronGridHeaders() });
  for (const tx of raw.data ?? []) {
    const contract = tx.raw_data?.contract?.[0];
    if (contract?.type !== "TransferContract") continue;
    const { owner_address, to_address } = contract.parameter.value;
    if (!owner_address || !to_address) continue;
    if (hexToTronAddress(to_address) === address) {
      return hexToTronAddress(owner_address);
    }
  }
  return null;
}

// Buy/sell method selectors on the SunPump proxy — both are `(address,uint256)`, so the target
// token address sits right after the selector in the call's raw hex data, and the TRX amount
// right after that. No log-diving needed here (unlike TokenCreate): the calldata already has
// everything, verified live against real recent purchaseToken/saleToken transactions.
const BUY_SELECTOR = "1cc2c911";
const SELL_SELECTOR = "d19aa2b9";

// Token symbol never changes, so a plain in-memory cache (no TTL) for the lifetime of the
// process is enough to avoid re-resolving the same token on every activity poll.
const symbolCache = new Map<string, string | null>();

async function resolveSymbolCached(address: string): Promise<string | null> {
  if (symbolCache.has(address)) return symbolCache.get(address)!;
  const symbol = await fetchTokenBasicInfo(address)
    .then((info) => info.symbol)
    .catch(() => null);
  symbolCache.set(address, symbol);
  return symbol;
}

// Same reasoning as symbolCache — a token's SunPump logo never changes once set, so a
// process-lifetime cache avoids re-fetching it on every 15s ticker poll for tokens that keep
// trading. This is what makes the activity ticker's pills show real token art instead of always
// falling back to the generated identicon.
const logoCache = new Map<string, string | null>();

async function resolveLogoCached(address: string): Promise<string | null> {
  if (logoCache.has(address)) return logoCache.get(address)!;
  const logoUrl = await fetchSunPumpLogo(address).catch(() => null);
  logoCache.set(address, logoUrl);
  return logoUrl;
}

interface TronGridSmartContractTx {
  txID: string;
  block_timestamp: number;
  raw_data: {
    contract: Array<{
      type: string;
      parameter: { value: { owner_address?: string; data?: string; call_value?: number } };
    }>;
  };
}

interface TronGridSmartContractTxsResponse {
  data?: TronGridSmartContractTx[];
}

export interface MemeActivityEventData {
  type: "buy" | "sell";
  tokenAddress: string;
  symbol: string | null;
  imageUrl: string | null;
  trxAmount: number | null;
  walletAddress: string;
  txId: string;
  timestamp: number;
}

/**
 * Recent buy/sell activity on SunPump, decoded straight from the proxy contract's own recent
 * transactions — one TronGrid call covers the whole batch (no per-event lookups needed, unlike
 * new-token detection). Symbol resolution is the only per-token cost, and it's cached.
 */
export async function fetchRecentActivity(limit: number): Promise<MemeActivityEventData[]> {
  const url = `${env.TRONGRID_BASE_URL}/v1/accounts/${SUNPUMP_CONTRACT}/transactions?only_confirmed=true&limit=${limit}`;
  const raw = await fetchJsonRetry<TronGridSmartContractTxsResponse>("trongrid", url, { headers: tronGridHeaders() });

  const decoded: Array<Omit<MemeActivityEventData, "symbol" | "imageUrl">> = [];
  for (const tx of raw.data ?? []) {
    const contract = tx.raw_data?.contract?.[0];
    if (contract?.type !== "TriggerSmartContract") continue;
    const { owner_address, data, call_value } = contract.parameter.value;
    if (!owner_address || !data) continue;

    const selector = data.slice(0, 8);
    const type = selector === BUY_SELECTOR ? "buy" : selector === SELL_SELECTOR ? "sell" : null;
    if (!type) continue;

    const tokenHex = data.slice(8, 72).replace(/^0+/, "");
    if (!tokenHex) continue;

    // The second calldata param is a token-denominated amount (min-out / sell quantity in the
    // token's own decimals), not a TRX value — decoding it as TRX produced nonsense numbers
    // during verification. The real TRX spent on a buy is the transaction's own `call_value`
    // (native TRX sent alongside the call); sells don't carry TRX in the call at all, so no
    // amount is reported for them rather than showing a misleading figure.
    decoded.push({
      type,
      tokenAddress: hexToTronAddress(tokenHex),
      trxAmount: type === "buy" && call_value ? call_value / 1_000_000 : null,
      walletAddress: hexToTronAddress(owner_address),
      txId: tx.txID,
      timestamp: tx.block_timestamp,
    });
  }

  // Sequential, not Promise.all — one TronScan/SunPump call per unique token, same rate-limit
  // discipline used everywhere else in this file. Both lookups are cached, so this only costs a
  // real network call the first time a given token shows up in the ticker.
  const results: MemeActivityEventData[] = [];
  for (const event of decoded) {
    const [symbol, imageUrl] = await Promise.all([
      resolveSymbolCached(event.tokenAddress),
      resolveLogoCached(event.tokenAddress),
    ]);
    results.push({ ...event, symbol, imageUrl });
  }
  return results;
}

// createAndInitPurchase(string,string) — verified live against a real transaction (a token
// creation observed while building this feature) rather than computed from memory, since a
// wrong selector here would silently make the "serial creator" detector find nothing and no one
// would notice. Same TriggerSmartContract shape as BUY_SELECTOR/SELL_SELECTOR above.
const CREATE_TOKEN_SELECTOR = "2f70d762";

export interface CreatorTokenEntry {
  address: string;
  symbol: string | null;
  name: string | null;
  status: string | null;
  holders: number | null;
  pumpPercentage: number | null;
}

interface TronGridAccountTx {
  txID: string;
  raw_data: {
    contract: Array<{
      type: string;
      parameter: { value: { owner_address?: string; contract_address?: string; data?: string } };
    }>;
  };
}

interface TronGridAccountTxsResponse {
  data?: TronGridAccountTx[];
}

// Bounds how many of the creator's own recent transactions we scan (one TronGrid call) and how
// many candidate token-creation calls we fully resolve (each needs its own tx-log fetch + a
// SunPump detail fetch) — a serial rugger with 50+ launches still gets flagged from their most
// recent activity, without turning one token-detail view into dozens of outbound calls.
const CREATOR_SCAN_LIMIT = 30;
const CREATOR_MAX_OTHER_TOKENS = 8;

/**
 * Other tokens the same wallet has launched on SunPump before, and their current status — the
 * clearest signal this platform can offer for free that a token's creator has a track record
 * (or a pattern of abandoning what they launch). Always an estimate: it only sees the creator's
 * most recent `CREATOR_SCAN_LIMIT` transactions, not their full history.
 */
export async function fetchCreatorTokenHistory(creatorAddress: string, excludeTokenAddress: string): Promise<CreatorTokenEntry[]> {
  const url = `${env.TRONGRID_BASE_URL}/v1/accounts/${creatorAddress}/transactions?only_confirmed=true&limit=${CREATOR_SCAN_LIMIT}&order_by=block_timestamp,desc`;
  const raw = await fetchJsonRetry<TronGridAccountTxsResponse>("trongrid", url, { headers: tronGridHeaders() });

  // contract_address/owner_address on a transaction carry the 21-byte "41"-prefixed hex form —
  // different from the bare 20-byte hex used in log topics/addresses elsewhere in this file
  // (see hexToTronAddress's own doc comment for the same distinction).
  const sunpumpContractPrefixed = `41${SUNPUMP_CONTRACT_HEX}`;
  const candidates = (raw.data ?? []).filter((tx) => {
    const c = tx.raw_data?.contract?.[0];
    if (c?.type !== "TriggerSmartContract") return false;
    const { contract_address, data } = c.parameter.value;
    return contract_address === sunpumpContractPrefixed && data?.startsWith(CREATE_TOKEN_SELECTOR);
  });

  const results: CreatorTokenEntry[] = [];
  for (const tx of candidates.slice(0, CREATOR_MAX_OTHER_TOKENS)) {
    try {
      const info = await fetchTransactionLog(tx.txID);
      const tokenLog = info.log?.find((l) => l.topics?.[0]?.startsWith(TRANSFER_TOPIC) && l.address !== SUNPUMP_CONTRACT_HEX);
      if (!tokenLog) continue;
      const tokenAddress = hexToTronAddress(tokenLog.address);
      if (tokenAddress === excludeTokenAddress) continue;

      const detail = await fetchSunPumpTokenDetail(tokenAddress).catch(() => null);
      results.push({
        address: tokenAddress,
        symbol: detail?.symbol ?? null,
        name: detail?.name ?? null,
        status: detail?.status ?? null,
        holders: detail?.holders ?? null,
        pumpPercentage: detail?.pumpPercentage ?? null,
      });
    } catch {
      continue;
    }
  }
  return results;
}

// Well-known tickers/names that scam tokens on launchpads commonly impersonate — verified
// firsthand while building this feature: a real, brand-new token calling itself "Tether USD"
// with symbol "USDT" was created on SunPump during testing. Deliberately small and specific
// (assets people would actually recognize and trust) rather than an open-ended fuzzy matcher
// that would flag legitimate tokens with common words in their name.
const KNOWN_ASSET_NAMES = new Set([
  "BITCOIN", "BTC", "ETHEREUM", "ETH", "TETHER", "USDT", "USD COIN", "USDC", "BNB", "BINANCE COIN",
  "SOLANA", "SOL", "TRON", "TRX", "DOGECOIN", "DOGE", "XRP", "RIPPLE", "CARDANO", "ADA",
  "SHIBA INU", "SHIB", "TONCOIN", "TON", "SUN", "JUST", "JST", "USDD",
]);

/** Flags a token whose name or symbol exactly matches a well-known asset it obviously isn't
 * (different contract) — the single cheapest, highest-signal impersonation check available
 * without a paid API. Case/whitespace-insensitive exact match only, not fuzzy, to avoid false
 * positives on tokens that merely reference a real asset in their description. */
export function detectNameSimilarityWarning(name: string | null, symbol: string | null): string | null {
  const candidates = [name, symbol].filter((v): v is string => !!v).map((v) => v.trim().toUpperCase());
  for (const c of candidates) {
    if (KNOWN_ASSET_NAMES.has(c)) {
      return `El nombre o símbolo de este token ("${c}") coincide con el de un activo conocido — verifica que no sea una imitación antes de confiar en él.`;
    }
  }
  return null;
}
