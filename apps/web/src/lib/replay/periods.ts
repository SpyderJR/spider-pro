export interface ReplayPeriod {
  id: string;
  label: string;
  symbol: string;
  /** ISO date the replay window starts at; null means "pick a random start". */
  startDate: string | null;
  days: number;
}

export const REPLAY_PERIODS: ReplayPeriod[] = [
  { id: "covid", label: "Crash COVID (marzo 2020)", symbol: "BTCUSDT", startDate: "2020-02-15", days: 60 },
  { id: "top-2021", label: "Techo de mercado (noviembre 2021)", symbol: "BTCUSDT", startDate: "2021-10-15", days: 60 },
  { id: "ftx", label: "Colapso de FTX (noviembre 2022)", symbol: "BTCUSDT", startDate: "2022-10-20", days: 50 },
  { id: "halving-2024", label: "Halving de Bitcoin (abril 2024)", symbol: "BTCUSDT", startDate: "2024-03-15", days: 60 },
  { id: "random", label: "Fecha aleatoria", symbol: "BTCUSDT", startDate: null, days: 60 },
];

export const REPLAY_INTERVALS = ["15m", "1h", "4h"] as const;
export type ReplayInterval = (typeof REPLAY_INTERVALS)[number];

export const REPLAY_SPEEDS = [1, 2, 5] as const;
export type ReplaySpeed = (typeof REPLAY_SPEEDS)[number];
