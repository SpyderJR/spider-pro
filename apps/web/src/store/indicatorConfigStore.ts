import { create } from "zustand";
import type { IndicatorConfig, Timeframe } from "@spider/types";

export interface SelectedToken {
  /** Bare ticker used against Binance/Bybit/CryptoCompare, e.g. "BTC". */
  symbol: string;
  /** CoinGecko coin id, e.g. "bitcoin" — powers the CoinGecko fallback layer. */
  coingeckoId: string;
  label: string;
}

export const BTC_TOKEN: SelectedToken = { symbol: "BTC", coingeckoId: "bitcoin", label: "Bitcoin" };
export const TRX_TOKEN: SelectedToken = { symbol: "TRX", coingeckoId: "tron", label: "TRON" };

type ToggleableKey = Exclude<keyof IndicatorConfig, "movingAverages">;

interface IndicatorConfigState {
  token: SelectedToken;
  timeframe: Timeframe;
  config: IndicatorConfig;
  setToken: (token: SelectedToken) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  toggleIndicator: (key: ToggleableKey) => void;
  toggleMa: (index: number) => void;
}

const defaultConfig: IndicatorConfig = {
  rsi: { enabled: true, period: 14 },
  macd: { enabled: true, fast: 12, slow: 26, signal: 9 },
  bollinger: { enabled: true, period: 20, stdDev: 2 },
  movingAverages: [
    { type: "SMA", period: 50, enabled: true },
    { type: "SMA", period: 200, enabled: true },
    { type: "EMA", period: 21, enabled: false },
  ],
  stochastic: { enabled: false, kPeriod: 14, dPeriod: 3, smooth: 3 },
  williamsR: { enabled: false, period: 14 },
  cci: { enabled: false, period: 20 },
  adx: { enabled: false, period: 14 },
  obv: { enabled: false },
  vwap: { enabled: false },
  parabolicSar: { enabled: false, step: 0.02, maxStep: 0.2 },
  roc: { enabled: false, period: 12 },
  mfi: { enabled: false, period: 14 },
};

export const useIndicatorConfigStore = create<IndicatorConfigState>((set) => ({
  token: BTC_TOKEN,
  timeframe: "1d",
  config: defaultConfig,
  setToken: (token) => set({ token }),
  setTimeframe: (timeframe) => set({ timeframe }),
  toggleIndicator: (key) =>
    set((s) => ({
      config: {
        ...s.config,
        [key]: { ...s.config[key], enabled: !s.config[key].enabled },
      },
    })),
  toggleMa: (index) =>
    set((s) => ({
      config: {
        ...s.config,
        movingAverages: s.config.movingAverages.map((ma, i) =>
          i === index ? { ...ma, enabled: !ma.enabled } : ma,
        ),
      },
    })),
}));
