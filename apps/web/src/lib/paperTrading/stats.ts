import type { ClosedTrade } from "./types";

export interface PaperTradingStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPnl: number;
  profitFactor: number | null;
  bestTrade: ClosedTrade | null;
  worstTrade: ClosedTrade | null;
  currentStreak: number; // positive = winning streak, negative = losing streak
  maxDrawdownPercent: number;
  balanceCurve: { time: number; balance: number }[];
}

export function computeStats(history: ClosedTrade[], initialBalance: number): PaperTradingStats {
  const chronological = [...history].sort((a, b) => a.closedAt - b.closedAt);

  const wins = chronological.filter((t) => t.pnl > 0);
  const losses = chronological.filter((t) => t.pnl <= 0);
  const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));

  let balance = initialBalance;
  const balanceCurve = [{ time: 0, balance }];
  let peak = balance;
  let maxDrawdownPercent = 0;
  for (const t of chronological) {
    balance += t.pnl;
    balanceCurve.push({ time: t.closedAt, balance });
    if (balance > peak) peak = balance;
    const drawdown = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
    if (drawdown > maxDrawdownPercent) maxDrawdownPercent = drawdown;
  }

  let currentStreak = 0;
  for (let i = chronological.length - 1; i >= 0; i--) {
    const isWin = chronological[i]!.pnl > 0;
    if (i === chronological.length - 1) {
      currentStreak = isWin ? 1 : -1;
      continue;
    }
    const sameDirection = currentStreak > 0 ? isWin : !isWin;
    if (sameDirection) currentStreak += currentStreak > 0 ? 1 : -1;
    else break;
  }

  const best = chronological.reduce<ClosedTrade | null>((max, t) => (!max || t.pnl > max.pnl ? t : max), null);
  const worst = chronological.reduce<ClosedTrade | null>((min, t) => (!min || t.pnl < min.pnl ? t : min), null);

  return {
    totalTrades: chronological.length,
    wins: wins.length,
    losses: losses.length,
    winRate: chronological.length > 0 ? (wins.length / chronological.length) * 100 : 0,
    totalPnl: chronological.reduce((sum, t) => sum + t.pnl, 0),
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : null,
    bestTrade: best,
    worstTrade: worst,
    currentStreak,
    maxDrawdownPercent,
    balanceCurve,
  };
}
