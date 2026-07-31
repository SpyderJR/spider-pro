export interface HistoricalCrash {
  id: string;
  asset: "BTC" | "TRX";
  name: string;
  startDate: string;
  peakPrice: number;
  bottomPrice: number;
  dropPercent: number;
  return6m: number | null;
  return12m: number | null;
  return18m: number | null;
  return24m: number | null;
  return36m: number | null;
}

export const HISTORICAL_CRASHES: HistoricalCrash[] = [
  {
    id: "btc-2018",
    asset: "BTC",
    name: "Crash post-ATH 2017",
    startDate: "2018-01",
    peakPrice: 19_666,
    bottomPrice: 3_191,
    dropPercent: -83.8,
    return6m: -12,
    return12m: 8,
    return18m: 95,
    return24m: 218,
    return36m: 590,
  },
  {
    id: "btc-2020-covid",
    asset: "BTC",
    name: "Crash COVID-19",
    startDate: "2020-02",
    peakPrice: 10_500,
    bottomPrice: 3_850,
    dropPercent: -63.3,
    return6m: 180,
    return12m: 560,
    return18m: 640,
    return24m: 250,
    return36m: 610,
  },
  {
    id: "btc-2021-may",
    asset: "BTC",
    name: "Crash de mayo 2021",
    startDate: "2021-05",
    peakPrice: 64_800,
    bottomPrice: 29_300,
    dropPercent: -54.8,
    return6m: 118,
    return12m: 5,
    return18m: -35,
    return24m: -22,
    return36m: 45,
  },
  {
    id: "btc-2022-luna-ftx",
    asset: "BTC",
    name: "Crash Terra/Luna + FTX",
    startDate: "2022-05",
    peakPrice: 48_000,
    bottomPrice: 15_500,
    dropPercent: -67.7,
    return6m: 15,
    return12m: 155,
    return18m: 300,
    return24m: 335,
    return36m: null,
  },
  {
    id: "trx-2018",
    asset: "TRX",
    name: "Crash post-ATH 2018",
    startDate: "2018-01",
    peakPrice: 0.3,
    bottomPrice: 0.0125,
    dropPercent: -95.8,
    return6m: 20,
    return12m: -30,
    return18m: -25,
    return24m: 15,
    return36m: 60,
  },
  {
    id: "trx-2022-luna-ftx",
    asset: "TRX",
    name: "Crash Terra/Luna + FTX",
    startDate: "2022-05",
    peakPrice: 0.09,
    bottomPrice: 0.05,
    dropPercent: -44.4,
    return6m: 30,
    return12m: 70,
    return18m: 90,
    return24m: 130,
    return36m: null,
  },
];
