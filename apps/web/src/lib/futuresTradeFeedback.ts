import type { FuturesClosedTrade } from "./futures/types";
import { stopLossUnreachable } from "./futures/liquidation";

export interface FuturesFeedbackContext {
  balanceBeforeTrade: number;
  /** Alligator trend read on the pair's timeframe at close time, if available. */
  alligatorTrend: "up" | "down" | "flat" | null;
}

type Trade = Omit<FuturesClosedTrade, "feedback">;
type Rule = (trade: Trade, ctx: FuturesFeedbackContext) => string | null;

const RULES: Rule[] = [
  // 1. Liquidado
  (trade) => {
    if (trade.exitReason !== "liquidation") return null;
    return `Te liquidaron: perdiste el margen completo de ${trade.margin.toFixed(2)} USD. Con ${trade.leverage}x de apalancamiento, tu liquidación estaba a solo ${(Math.abs(trade.entryPrice - trade.liquidationPrice) / trade.entryPrice * 100).toFixed(2)}% de tu entrada — el movimiento normal del mercado alcanzó para borrarte, tuvieras razón o no en la dirección.`;
  },
  // 2. Liquidado con apalancamiento muy alto — mensaje específico
  (trade) => {
    if (trade.exitReason === "liquidation" && trade.leverage >= 25) {
      return `Un apalancamiento de ${trade.leverage}x deja prácticamente cero margen de error frente al ruido normal del mercado. Esta no fue mala suerte puntual — es el resultado esperable de operar así de apalancado de forma sostenida.`;
    }
    return null;
  },
  // 3. Sobrevivió con apalancamiento alto — advertencia aunque haya ganado
  (trade) => {
    if (trade.exitReason !== "liquidation" && trade.leverage >= 20 && trade.pnl > 0) {
      return `Ganaste esta vez con ${trade.leverage}x, pero a ese apalancamiento tu margen de error era mínimo — el mismo trade con un poco más de ruido en contra hubiera terminado en liquidación en vez de ganancia.`;
    }
    return null;
  },
  // 4. Funding significativo
  (trade) => {
    const fundingAbs = Math.abs(trade.fundingPaid);
    if (fundingAbs > 0 && trade.pnl !== 0 && fundingAbs / Math.abs(trade.pnl) > 0.2) {
      return trade.fundingPaid > 0
        ? `El funding te costó ${trade.fundingPaid.toFixed(2)} USD mientras mantuviste la posición abierta — una parte considerable de tu resultado. Mantener posiciones apalancadas mucho tiempo tiene un costo continuo, no es gratis.`
        : `Cobraste ${Math.abs(trade.fundingPaid).toFixed(2)} USD de funding por estar del lado minoritario — un ingreso extra que sumó a tu resultado, pero que puede cambiar de signo en cualquier momento.`;
    }
    return null;
  },
  // 5. Short contra tendencia alcista del Alligator
  (trade, ctx) => {
    if (trade.side === "short" && ctx.alligatorTrend === "up") {
      return "Abriste un short mientras el Alligator mostraba tendencia alcista confirmada — operar en contra de la tendencia dominante exige una señal más fuerte y un stop más ajustado que operar a favor de ella.";
    }
    return null;
  },
  // 6. Long contra tendencia bajista del Alligator
  (trade, ctx) => {
    if (trade.side === "long" && ctx.alligatorTrend === "down") {
      return "Abriste un long mientras el Alligator mostraba tendencia bajista confirmada — remar contra la corriente dominante es posible, pero estadísticamente más difícil que operar a favor de ella.";
    }
    return null;
  },
  // 7. Stop loss inalcanzable (se liquidó antes de que el SL pudiera ejecutarse)
  (trade) => {
    if (trade.stopLoss !== null && stopLossUnreachable(trade.side, trade.stopLoss, trade.liquidationPrice)) {
      return "Tu stop loss estaba más lejos que tu precio de liquidación: nunca hubiera llegado a ejecutarse. Con el apalancamiento que usaste, la liquidación actuó como tu verdadero (y peor) stop loss.";
    }
    return null;
  },
  // 8. Buena disciplina de apalancamiento bajo
  (trade) => {
    if (trade.leverage <= 5 && trade.exitReason !== "liquidation") {
      return `Usaste ${trade.leverage}x — un apalancamiento conservador que deja margen de sobra frente al ruido del mercado. Así operan los profesionales que sí usan futuros.`;
    }
    return null;
  },
  // 9. Margen cruzado con pérdida grande
  (trade, ctx) => {
    const lossPercent = trade.pnl < 0 ? Math.abs(trade.pnl / ctx.balanceBeforeTrade) * 100 : 0;
    if (trade.marginMode === "cross" && lossPercent > 5) {
      return `Perdiste ${lossPercent.toFixed(1)}% de tu cuenta en una sola operación con margen cruzado — con margen aislado, la pérdida máxima hubiera estado limitada al margen que le asignaste a esta posición.`;
    }
    return null;
  },
  // 10. Trade ganador — refuerzo positivo
  (trade) => {
    if (trade.pnl > 0 && trade.exitReason !== "liquidation") {
      return `Trade cerrado en ganancia (+${trade.pnl.toFixed(2)} USD). Anotá en el Diario qué combinación de apalancamiento, SL y contexto de mercado te funcionó acá.`;
    }
    return null;
  },
];

/** Evaluates every futures rule against a closed trade — never usa IA, siempre reglas programadas. */
export function generateFuturesTradeFeedback(trade: Trade, ctx: FuturesFeedbackContext): string[] {
  return RULES.map((rule) => rule(trade, ctx)).filter((msg): msg is string => msg !== null);
}
