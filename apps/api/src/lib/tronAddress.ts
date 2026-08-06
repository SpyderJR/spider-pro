import { createHash } from "node:crypto";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Encode(buf: Buffer): string {
  let num = BigInt(`0x${buf.toString("hex")}`);
  let out = "";
  while (num > 0n) {
    const rem = Number(num % 58n);
    out = BASE58_ALPHABET[rem] + out;
    num /= 58n;
  }
  for (const byte of buf) {
    if (byte === 0) out = `1${out}`;
    else break;
  }
  return out;
}

/**
 * Converts a TRON hex address into its base58check "T..." form. Accepts both
 * shapes seen across TronGrid responses: a bare 20-byte address (40 hex
 * chars, as found in event log `address`/topic fields) or an already-prefixed
 * 21-byte address (42 hex chars starting with "41", as found in transaction
 * `owner_address`/`contract_address` fields) — length decides which, since a
 * bare 20-byte address could legitimately start with byte 0x41 itself and
 * must never be mistaken for an already-prefixed one.
 * Verified against a real on-chain case (a SunPump TokenCreate event) during
 * planning — see Bloque 14 plan.
 */
export function hexToTronAddress(hex: string): string {
  const clean = hex.replace(/^0x/, "");
  const addressBytes = Buffer.from(clean.length === 40 ? `41${clean}` : clean, "hex");
  const hash1 = createHash("sha256").update(addressBytes).digest();
  const hash2 = createHash("sha256").update(hash1).digest();
  const checksum = hash2.subarray(0, 4);
  return base58Encode(Buffer.concat([addressBytes, checksum]));
}
