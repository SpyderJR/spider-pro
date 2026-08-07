// Public Binance USD-M Futures market data — keyless, called directly from the browser.
const FUTURES_BASE = "https://fapi.binance.com";

const FALLBACK_FUNDING_RATE = 0.0001; // 0.01% per 8h — representative for a calm BTC market

export async function fetchFundingRate(symbol: string): Promise<number> {
  try {
    const res = await fetch(`${FUTURES_BASE}/fapi/v1/premiumIndex?symbol=${symbol}`);
    if (!res.ok) return FALLBACK_FUNDING_RATE;
    const json = await res.json();
    const rate = Number(json.lastFundingRate);
    return Number.isFinite(rate) ? rate : FALLBACK_FUNDING_RATE;
  } catch {
    return FALLBACK_FUNDING_RATE;
  }
}

export { FALLBACK_FUNDING_RATE };

/** Open interest (in the base asset, not USD) for a USD-M perpetual — null when the symbol has
 * no futures market (most spot-only pairs from the new token search don't). Verified live,
 * keyless, same public Binance futures API as funding rate. */
export async function fetchOpenInterest(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`${FUTURES_BASE}/fapi/v1/openInterest?symbol=${symbol}`);
    if (!res.ok) return null;
    const json = await res.json();
    const value = Number(json.openInterest);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}
