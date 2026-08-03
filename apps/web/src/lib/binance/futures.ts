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
