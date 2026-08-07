export interface PositionSizeResult {
  riskAmount: number;
  positionSizeUsd: number;
  quantity: number;
  distancePercent: number;
}

/** How much you can size a trade so a stop loss hit never costs more than the risk % you chose. */
export function computePositionSize(
  balance: number,
  riskPercent: number,
  entryPrice: number,
  stopLoss: number,
): PositionSizeResult | null {
  if (balance <= 0 || riskPercent <= 0 || entryPrice <= 0) return null;
  const distancePercent = (Math.abs(entryPrice - stopLoss) / entryPrice) * 100;
  if (distancePercent === 0) return null;
  const riskAmount = balance * (riskPercent / 100);
  const positionSizeUsd = riskAmount / (distancePercent / 100);
  const quantity = positionSizeUsd / entryPrice;
  return { riskAmount, positionSizeUsd, quantity, distancePercent };
}

/** Minimum win rate needed just to break even at a given reward:risk ratio (ignores fees). */
export function breakevenWinRate(riskRewardRatio: number): number {
  if (riskRewardRatio <= 0) return 100;
  return (1 / (1 + riskRewardRatio)) * 100;
}

/** % gain required to fully recover from a given % loss — grows non-linearly, the core lesson of risk management. */
export function drawdownRecoveryPercent(lossPercent: number): number {
  if (lossPercent >= 100) return Infinity;
  return (lossPercent / (100 - lossPercent)) * 100;
}

export interface StreakSimResult {
  balanceCurve: number[];
  finalBalance: number;
  wentBust: boolean;
  bustAtTrade: number | null;
  wins: number;
  losses: number;
}

/**
 * Simulates `trades` sequential trades at a fixed risk % per trade and reward:risk multiple.
 * Never uses AI — pure probability simulation, exactly what a real account curve looks like
 * under a given risk profile.
 */
export function simulateStreak(
  initialBalance: number,
  riskPercent: number,
  winRatePercent: number,
  rewardMultiple: number,
  trades: number,
): StreakSimResult {
  let balance = initialBalance;
  const curve = [balance];
  let wentBust = false;
  let bustAtTrade: number | null = null;
  let wins = 0;
  let losses = 0;

  for (let i = 0; i < trades; i++) {
    if (balance <= 1) {
      curve.push(0);
      continue;
    }
    const isWin = Math.random() * 100 < winRatePercent;
    const riskAmount = balance * (riskPercent / 100);
    if (isWin) {
      balance += riskAmount * rewardMultiple;
      wins++;
    } else {
      balance -= riskAmount;
      losses++;
    }
    if (balance <= 1 && !wentBust) {
      wentBust = true;
      bustAtTrade = i + 1;
      balance = 0;
    }
    curve.push(balance);
  }

  return { balanceCurve: curve, finalBalance: balance, wentBust, bustAtTrade, wins, losses };
}

export interface MonteCarloParams {
  initialBalance: number;
  riskPercent: number;
  winRatePercent: number;
  rewardMultiple: number;
  trades: number;
}

export interface MonteCarloResult {
  /** Percentile bands of balance at each trade index (length = trades + 1) — the fan chart. */
  percentileCurves: { p10: number[]; p50: number[]; p90: number[] };
  /** % of the 1000 simulated paths that hit bust (balance <= 1) at some point — the actual
   * probability of ruin, not a single pass/fail from one lucky or unlucky run. */
  ruinProbabilityPercent: number;
  medianFinalBalance: number;
  iterations: number;
}

function percentileOf(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.min(sortedValues.length - 1, Math.floor((p / 100) * sortedValues.length));
  return sortedValues[index]!;
}

/**
 * Monte Carlo probability-of-ruin simulator — runs `simulateStreak` `iterations` times (1000 by
 * default) and aggregates the distribution, instead of showing the single random path
 * `StreakSimulator` illustrates. The same win-rate/RR inputs can now produce wildly different
 * individual outcomes; this shows the actual spread and the real % that go bust.
 */
export function runMonteCarloSimulation(params: MonteCarloParams, iterations = 1000): MonteCarloResult {
  const { initialBalance, riskPercent, winRatePercent, rewardMultiple, trades } = params;
  const curves: number[][] = [];
  let bustCount = 0;

  for (let i = 0; i < iterations; i++) {
    const sim = simulateStreak(initialBalance, riskPercent, winRatePercent, rewardMultiple, trades);
    curves.push(sim.balanceCurve);
    if (sim.wentBust) bustCount++;
  }

  const numPoints = trades + 1;
  const p10: number[] = new Array(numPoints);
  const p50: number[] = new Array(numPoints);
  const p90: number[] = new Array(numPoints);

  for (let t = 0; t < numPoints; t++) {
    const valuesAtT = curves.map((c) => c[t] ?? 0).sort((a, b) => a - b);
    p10[t] = percentileOf(valuesAtT, 10);
    p50[t] = percentileOf(valuesAtT, 50);
    p90[t] = percentileOf(valuesAtT, 90);
  }

  const finalBalances = curves.map((c) => c[c.length - 1] ?? 0).sort((a, b) => a - b);

  return {
    percentileCurves: { p10, p50, p90 },
    ruinProbabilityPercent: Math.round((bustCount / iterations) * 100),
    medianFinalBalance: percentileOf(finalBalances, 50),
    iterations,
  };
}
