export const env = {
  PORT: Number(process.env.PORT ?? 8787),
  TRONSCAN_API_KEY: process.env.TRONSCAN_API_KEY ?? "",
  XAI_API_KEY: process.env.XAI_API_KEY ?? "",
  CRYPTOCOMPARE_API_KEY: process.env.CRYPTOCOMPARE_API_KEY ?? "",

  BINANCE_BASE_URL: process.env.BINANCE_BASE_URL ?? "https://api.binance.com",
  BYBIT_BASE_URL: process.env.BYBIT_BASE_URL ?? "https://api.bybit.com",
  CRYPTOCOMPARE_BASE_URL:
    process.env.CRYPTOCOMPARE_BASE_URL ?? "https://min-api.cryptocompare.com",
  COINGECKO_BASE_URL: process.env.COINGECKO_BASE_URL ?? "https://api.coingecko.com",
  ALTERNATIVE_ME_BASE_URL:
    process.env.ALTERNATIVE_ME_BASE_URL ?? "https://api.alternative.me",
  FRED_BASE_URL: process.env.FRED_BASE_URL ?? "https://fred.stlouisfed.org",
  TRONSCAN_BASE_URL:
    process.env.TRONSCAN_BASE_URL ?? "https://apilist.tronscanapi.com",
  TRONGRID_BASE_URL: process.env.TRONGRID_BASE_URL ?? "https://api.trongrid.io",
  XAI_BASE_URL: process.env.XAI_BASE_URL ?? "https://api.x.ai",
};
