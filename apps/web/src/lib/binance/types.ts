export interface BinanceCandle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface LiveKline extends BinanceCandle {
  /** true once this candle's interval has fully closed (kline stream's `x` flag). */
  isFinal: boolean;
}

export interface Ticker24h {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

export interface DepthLevel {
  price: number;
  qty: number;
}

export interface OrderBookSnapshot {
  bids: DepthLevel[];
  asks: DepthLevel[];
}

export interface RecentTrade {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

export const BINANCE_PAIRS = ["BTCUSDT", "TRXUSDT"] as const;
export type BinancePair = (typeof BINANCE_PAIRS)[number];

export const TERMINAL_INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"] as const;
export type TerminalInterval = (typeof TERMINAL_INTERVALS)[number];
