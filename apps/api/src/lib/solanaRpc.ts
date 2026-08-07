import { fetchJson } from "./http.js";

// Solana Labs' own public RPC — free, keyless, rate-limited but fine for occasional balance
// polling with caching. Same "public infra, no key" pattern as ethRpc.ts / mempool.space.
const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

interface JsonRpcResponse<T> {
  result?: T;
  error?: { code: number; message: string };
}

async function solanaCall<T>(method: string, params: unknown[]): Promise<T> {
  const raw = await fetchJson<JsonRpcResponse<T>>("solana-rpc", SOLANA_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (raw.error) throw new Error(`solana-rpc ${method} failed: ${raw.error.message}`);
  if (raw.result === undefined) throw new Error(`solana-rpc ${method} returned no result`);
  return raw.result;
}

/** Native SOL balance for an address, in whole SOL. */
export async function fetchSolBalance(address: string): Promise<number> {
  const result = await solanaCall<{ value: number }>("getBalance", [address]);
  return result.value / 1e9;
}
