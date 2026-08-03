import type { ClosedTrade } from "./paperTrading/types";
import type { FractalPoint } from "./fractals";

export interface FeedbackContext {
  balanceBeforeTrade: number;
  fearGreedValue: number | null;
  fearGreedClassification: string | null;
  /** Fractals detected on the pair's recent candles (any timeframe available at close time). */
  nearbyFractals: FractalPoint[];
  /** Price of each fractal in `nearbyFractals`, same order — kept separate so callers can pass raw detectFractals() output. */
  fractalPrices: number[];
}

type Trade = Omit<ClosedTrade, "feedback">;
type Rule = (trade: Trade, ctx: FeedbackContext) => string | null;

function riskPercent(trade: Trade, balanceBeforeTrade: number): number | null {
  if (trade.stopLoss === null) return null;
  const riskPerUnit = trade.side === "buy" ? trade.entryPrice - trade.stopLoss : trade.stopLoss - trade.entryPrice;
  if (riskPerUnit <= 0) return null;
  const riskUsd = riskPerUnit * trade.quantity;
  return (riskUsd / balanceBeforeTrade) * 100;
}

function nearestFractalPrice(trade: Trade, ctx: FeedbackContext): number | null {
  if (ctx.fractalPrices.length === 0) return null;
  let nearest = ctx.fractalPrices[0]!;
  let bestDist = Math.abs(nearest - trade.entryPrice);
  for (const p of ctx.fractalPrices) {
    const d = Math.abs(p - trade.entryPrice);
    if (d < bestDist) {
      bestDist = d;
      nearest = p;
    }
  }
  return nearest;
}

const RULES: Rule[] = [
  // 1. Riesgo muy alto
  (trade, ctx) => {
    const risk = riskPercent(trade, ctx.balanceBeforeTrade);
    if (risk !== null && risk > 8) {
      return `Arriesgaste ${risk.toFixed(1)}% de tu cuenta en este trade — muy por encima del 1-2% recomendado. Con ese nivel de riesgo, 3 pérdidas seguidas te dejan con menos de la mitad del balance.`;
    }
    return null;
  },
  // 2. Riesgo elevado (no crítico)
  (trade, ctx) => {
    const risk = riskPercent(trade, ctx.balanceBeforeTrade);
    if (risk !== null && risk > 3 && risk <= 8) {
      return `Arriesgaste ${risk.toFixed(1)}% de tu cuenta — por encima del 3% que solemos marcar como límite de alerta. Revisá la calculadora de tamaño de posición en Gestión de Riesgo.`;
    }
    return null;
  },
  // 3. Riesgo bien gestionado
  (trade, ctx) => {
    const risk = riskPercent(trade, ctx.balanceBeforeTrade);
    if (risk !== null && risk <= 1.5 && risk > 0) {
      return `Buen tamaño de posición: arriesgaste solo ${risk.toFixed(1)}% de tu cuenta. Así se sobrevive a una racha de pérdidas sin quebrar la cuenta.`;
    }
    return null;
  },
  // 4. Sin stop loss
  (trade) => {
    if (trade.stopLoss === null) {
      return "Este trade no tuvo stop loss definido — el riesgo era técnicamente ilimitado. Definir el SL antes de entrar, no después, es de las reglas más importantes.";
    }
    return null;
  },
  // 5. Sin take profit
  (trade) => {
    if (trade.takeProfit === null) {
      return "No definiste un take profit — está bien salir manualmente, pero tener un objetivo previo ayuda a no dudar en el momento.";
    }
    return null;
  },
  // 6. Stop loss dentro del ruido normal
  (trade, ctx) => {
    if (trade.stopLoss === null) return null;
    const distPercent = (Math.abs(trade.entryPrice - trade.stopLoss) / trade.entryPrice) * 100;
    if (distPercent < 0.4) {
      const nearest = nearestFractalPrice(trade, ctx);
      const nearestNote = nearest !== null ? ` El fractal confirmado más cercano estaba en $${nearest.toFixed(2)}.` : "";
      return `Tu stop loss estaba a solo ${distPercent.toFixed(2)}% de la entrada — dentro del ruido normal del mercado, con alta probabilidad de saltar sin que la tendencia realmente se haya invalidado.${nearestNote}`;
    }
    return null;
  },
  // 7. Buen ratio riesgo/beneficio
  (trade) => {
    if (trade.stopLoss === null || trade.takeProfit === null) return null;
    const risk = trade.side === "buy" ? trade.entryPrice - trade.stopLoss : trade.stopLoss - trade.entryPrice;
    const reward = trade.side === "buy" ? trade.takeProfit - trade.entryPrice : trade.entryPrice - trade.takeProfit;
    if (risk > 0 && reward > 0) {
      const ratio = reward / risk;
      if (ratio >= 2) {
        return `Buen ratio riesgo/beneficio de 1:${ratio.toFixed(1)} — con esta relación podés perder más trades de los que ganás y aun así ser rentable.`;
      }
      if (ratio < 1) {
        return `Tu ratio riesgo/beneficio fue de 1:${ratio.toFixed(1)} — estás arriesgando más de lo que buscás ganar. Necesitás un win rate muy alto para que esto sea rentable a largo plazo.`;
      }
    }
    return null;
  },
  // 8. Codicia extrema al comprar
  (trade, ctx) => {
    if (trade.side === "buy" && ctx.fearGreedValue !== null && ctx.fearGreedValue > 75) {
      return `Entraste en compra con el Fear & Greed en ${ctx.fearGreedValue} (codicia extrema) — zona histórica de mayor cautela, no necesariamente de mayor oportunidad.`;
    }
    return null;
  },
  // 9. Miedo extremo al comprar (contrarian, elogio)
  (trade, ctx) => {
    if (trade.side === "buy" && ctx.fearGreedValue !== null && ctx.fearGreedValue < 25) {
      return `Compraste con el Fear & Greed en ${ctx.fearGreedValue} (miedo extremo) — históricamente esta zona coincidió con mejores puntos de entrada de largo plazo que la euforia.`;
    }
    return null;
  },
  // 10. Miedo extremo al vender
  (trade, ctx) => {
    if (trade.side === "sell" && ctx.fearGreedValue !== null && ctx.fearGreedValue < 25) {
      return `Vendiste (abriste corto) con Fear & Greed en ${ctx.fearGreedValue} — miedo extremo. Perseguir la caída justo en el momento de mayor pánico suele dar peor precio promedio que esperar confirmación.`;
    }
    return null;
  },
  // 11. Confluencia con fractal
  (trade, ctx) => {
    const nearest = nearestFractalPrice(trade, ctx);
    if (nearest !== null) {
      const distPercent = (Math.abs(nearest - trade.entryPrice) / trade.entryPrice) * 100;
      if (distPercent < 0.5) {
        return `Buena entrada técnica: había un fractal confirmado a menos de ${distPercent.toFixed(2)}% de tu precio de entrada ($${nearest.toFixed(2)}) — entraste sobre un nivel real de estructura, no en un precio arbitrario.`;
      }
    }
    return null;
  },
  // 12. Trade ganador — refuerzo positivo
  (trade) => {
    if (trade.pnl > 0) {
      return `Trade cerrado en ganancia (+$${trade.pnl.toFixed(2)}, ${trade.pnlPercent.toFixed(2)}%). Guardá qué señales te llevaron a esta entrada en el Diario — repetir lo que funciona es tan importante como evitar lo que no.`;
    }
    return null;
  },
  // 13. Pérdida pequeña y controlada
  (trade, ctx) => {
    if (trade.pnl < 0 && trade.exitReason === "stop_loss") {
      const lossPercent = Math.abs((trade.pnl / ctx.balanceBeforeTrade) * 100);
      if (lossPercent <= 1.5) {
        return `Perdiste, pero tu stop loss funcionó exactamente como debía: pérdida controlada de ${lossPercent.toFixed(2)}% de la cuenta. Perder poco y de forma controlada también es una victoria de gestión.`;
      }
    }
    return null;
  },
  // 14. Cierre manual en pérdida sin tocar SL — posible salida emocional
  (trade) => {
    if (trade.pnl < 0 && trade.exitReason === "manual" && trade.stopLoss !== null) {
      return "Cerraste manualmente en pérdida sin que se tocara tu stop loss. Si la premisa técnica del trade seguía intacta, vale la pena revisar en el Diario si fue una decisión racional o una salida por ansiedad.";
    }
    return null;
  },
  // 15. Take profit alcanzado
  (trade) => {
    if (trade.exitReason === "take_profit") {
      return "Tu take profit se ejecutó según lo planeado — el trade salió exactamente como lo definiste antes de entrar. Esa disciplina es más valiosa que el resultado de un trade individual.";
    }
    return null;
  },
  // 16. Trade muy corto en duración
  (trade) => {
    const durationMinutes = (trade.closedAt - trade.openedAt) / 60000;
    if (durationMinutes < 2 && trade.exitReason === "manual") {
      return "Cerraste este trade en menos de 2 minutos sin tocar SL/TP — si no tenías un plan de salida claro, vale la pena preguntarte qué cambió tu decisión tan rápido.";
    }
    return null;
  },
];

/** Evaluates every rule against a closed trade + market context — never uses AI, siempre reglas programadas. */
export function generateTradeFeedback(trade: Trade, ctx: FeedbackContext): string[] {
  return RULES.map((rule) => rule(trade, ctx)).filter((msg): msg is string => msg !== null);
}
