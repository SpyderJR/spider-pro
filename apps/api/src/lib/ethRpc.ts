import { fetchJson } from "./http.js";

// Public, keyless Ethereum JSON-RPC endpoint — same "public infra, no key" pattern already used
// for mempool.space (BTC) and TronGrid's unkeyed calls elsewhere in this codebase. Verified live
// before picking this one — eth.llamarpc.com returned Cloudflare 521s during testing while
// publicnode.com answered correctly, so that's the one actually shipped. Any standard Ethereum
// JSON-RPC endpoint (eth.drpc.org, etc.) is a drop-in replacement if this one ever degrades.
const ETH_RPC_URL = "https://ethereum.publicnode.com";

interface JsonRpcResponse<T> {
  result?: T;
  error?: { code: number; message: string };
}

async function ethCall<T>(method: string, params: unknown[]): Promise<T> {
  const raw = await fetchJson<JsonRpcResponse<T>>("eth-rpc", ETH_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (raw.error) throw new Error(`eth-rpc ${method} failed: ${raw.error.message}`);
  if (raw.result === undefined) throw new Error(`eth-rpc ${method} returned no result`);
  return raw.result;
}

/** Native ETH balance for an address, in whole ETH. */
export async function fetchEthBalance(address: string): Promise<number> {
  const hex = await ethCall<string>("eth_getBalance", [address, "latest"]);
  return Number(BigInt(hex)) / 1e18;
}

function padAddress(address: string): string {
  return address.toLowerCase().replace("0x", "").padStart(64, "0");
}

// balanceOf(address) and decimals() function selectors — standard ERC-20 ABI, the same 4 bytes
// on every compliant token contract, so no per-token ABI needs to be shipped.
const BALANCE_OF_SELECTOR = "0x70a08231";
const DECIMALS_SELECTOR = "0x313ce567";

/** Reads an ERC-20 balance directly via `eth_call` — no API key, works for any contract. Fetches
 * `decimals()` from the contract itself rather than assuming 18, since a wrong hardcoded decimals
 * value would silently misreport the balance by orders of magnitude. */
export async function fetchErc20Balance(walletAddress: string, contractAddress: string): Promise<number> {
  const [balanceHex, decimalsHex] = await Promise.all([
    ethCall<string>("eth_call", [{ to: contractAddress, data: `${BALANCE_OF_SELECTOR}${padAddress(walletAddress)}` }, "latest"]),
    ethCall<string>("eth_call", [{ to: contractAddress, data: DECIMALS_SELECTOR }, "latest"]),
  ]);
  const decimals = Number(BigInt(decimalsHex));
  return Number(BigInt(balanceHex)) / 10 ** decimals;
}
