import type { BinanceCandle } from "../binance/types";
import type { ClosedTrade } from "../paperTrading/types";
import { computeStats, type PaperTradingStats } from "../paperTrading/stats";

export interface ReplaySummary {
  initialBalance: number;
  finalBalance: number;
  returnPercent: number;
  holdReturnPercent: number;
  outperformedHold: boolean;
  stats: PaperTradingStats;
  feedback: string[];
}

export function buildReplaySummary(
  candles: BinanceCandle[],
  startIndex: number,
  endIndex: number,
  initialBalance: number,
  finalBalance: number,
  history: ClosedTrade[],
): ReplaySummary {
  const startPrice = candles[startIndex]?.close ?? 1;
  const endPrice = candles[Math.min(endIndex, candles.length - 1)]?.close ?? startPrice;
  const holdReturnPercent = ((endPrice - startPrice) / startPrice) * 100;
  const returnPercent = ((finalBalance - initialBalance) / initialBalance) * 100;
  const stats = computeStats(history, initialBalance);
  const outperformedHold = returnPercent > holdReturnPercent;

  const feedback: string[] = [];

  if (history.length === 0) {
    feedback.push(
      "No hiciste ninguna operación durante este replay. Está bien esperar si no viste una señal clara, pero practica entrando en algunos trades para poder evaluar tu criterio.",
    );
  } else {
    feedback.push(
      outperformedHold
        ? `Le ganaste a "holdear" el período completo: ${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(1)}% vs ${holdReturnPercent >= 0 ? "+" : ""}${holdReturnPercent.toFixed(1)}% de solo mantener la posición.`
        : `Holdear el período completo hubiera rendido ${holdReturnPercent >= 0 ? "+" : ""}${holdReturnPercent.toFixed(1)}%, más que tu ${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(1)}%. Operar activamente no siempre le gana al mercado — a veces cuesta más en comisiones y errores de lo que suma.`,
    );

    if (stats.totalTrades >= 3 && stats.winRate < 40) {
      feedback.push(`Tu win rate fue de ${stats.winRate.toFixed(0)}%, por debajo del 40%. Vale la pena revisar qué señales estás usando para entrar.`);
    }
    if (stats.maxDrawdownPercent > 20) {
      feedback.push(`Tuviste un drawdown máximo de ${stats.maxDrawdownPercent.toFixed(0)}% durante el replay — en una cuenta real, caídas así son difíciles de sostener psicológicamente.`);
    }
    if (stats.profitFactor !== null && stats.profitFactor < 1) {
      feedback.push("Tu profit factor terminó por debajo de 1: en conjunto, perdiste más de lo que ganaste.");
    }
    if (stats.totalTrades >= 5 && stats.winRate >= 55 && returnPercent > 0) {
      feedback.push("Buen manejo general: ganaste más operaciones de las que perdiste y terminaste en positivo.");
    }
  }

  return { initialBalance, finalBalance, returnPercent, holdReturnPercent, outperformedHold, stats, feedback };
}
