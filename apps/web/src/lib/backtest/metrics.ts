import type { BacktestMetrics, BacktestTrade, EquityPoint } from "@spider/types";

export function computeMetrics(trades: BacktestTrade[], equityCurve: EquityPoint[], initialBalance: number): BacktestMetrics {
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;

  const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  let peak = initialBalance;
  let maxDrawdownPercent = 0;
  for (const point of equityCurve) {
    if (point.value > peak) peak = point.value;
    const drawdown = peak > 0 ? ((peak - point.value) / peak) * 100 : 0;
    if (drawdown > maxDrawdownPercent) maxDrawdownPercent = drawdown;
  }

  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0;
  const expectancy = (winRate / 100) * avgWin - (1 - winRate / 100) * avgLoss;

  const finalBalance = equityCurve.length > 0 ? equityCurve[equityCurve.length - 1]!.value : initialBalance;
  const totalReturnPercent = initialBalance > 0 ? ((finalBalance - initialBalance) / initialBalance) * 100 : 0;

  return { totalTrades, winRate, profitFactor, maxDrawdownPercent, expectancy, finalBalance, totalReturnPercent };
}
