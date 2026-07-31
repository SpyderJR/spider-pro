export interface QuarterlySupply {
  quarter: string;
  usdtSupplyBillions: number;
}

export const USDT_QUARTERLY_GROWTH: QuarterlySupply[] = [
  { quarter: "2022 Q1", usdtSupplyBillions: 33 },
  { quarter: "2022 Q3", usdtSupplyBillions: 40 },
  { quarter: "2023 Q1", usdtSupplyBillions: 38 },
  { quarter: "2023 Q3", usdtSupplyBillions: 45 },
  { quarter: "2024 Q1", usdtSupplyBillions: 50 },
  { quarter: "2024 Q3", usdtSupplyBillions: 55 },
  { quarter: "2025 Q1", usdtSupplyBillions: 58 },
];
