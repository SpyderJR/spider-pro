import type { Candle, CoinMarketData, FearGreedResponse } from "@spider/types";
import { alligator } from "@spider/indicators";
import { detectFractals } from "./fractals";
import type { ClosedTrade, Position } from "./paperTrading/types";

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function summarizeFractals(candles: Candle[] | undefined, label: string) {
  if (!candles || candles.length < 5) return [];
  const points = detectFractals(candles, 2).slice(-3);
  return points.map((f) => ({
    timeframe: label,
    tipo: f.type === "bullish" ? "alcista" : "bajista",
    precio: round(f.price, f.price < 1 ? 6 : 2),
    velasAtras: candles.length - 1 - f.confirmedAtIndex,
  }));
}

function summarizeAlligator(candles: Candle[] | undefined): string | null {
  if (!candles || candles.length < 20) return null;
  const points = alligator(candles);
  const last = points.at(-1);
  if (!last || last.jaw === null || last.teeth === null || last.lips === null) return null;

  const lastPrice = candles.at(-1)!.close;
  const spread = (Math.max(last.jaw, last.teeth, last.lips) - Math.min(last.jaw, last.teeth, last.lips)) / lastPrice;

  if (spread < 0.003) return "dormido (rango, sin tendencia clara)";
  const bullishOrder = last.lips > last.teeth && last.teeth > last.jaw;
  const bearishOrder = last.lips < last.teeth && last.teeth < last.jaw;
  if (bullishOrder && spread > 0.008) return "comiendo hacia arriba (tendencia alcista establecida)";
  if (bearishOrder && spread > 0.008) return "comiendo hacia abajo (tendencia bajista establecida)";
  return "despertando (líneas cruzándose, tendencia poco clara todavía)";
}

function summarizeAccount(balance: number, positions: Position[], history: ClosedTrade[]) {
  const openPosition = positions[0];
  const lastTrades = [...history]
    .sort((a, b) => b.closedAt - a.closedAt)
    .slice(0, 3)
    .map((t) => ({
      par: t.pair,
      lado: t.side === "buy" ? "compra" : "venta",
      resultadoUsd: round(t.pnl, 2),
      leccionPrincipal: t.feedback[0] ?? null,
    }));

  return {
    balance: round(balance, 2),
    posicionAbierta: openPosition
      ? {
          par: openPosition.pair,
          lado: openPosition.side === "buy" ? "compra" : "venta",
          entrada: round(openPosition.entryPrice, openPosition.entryPrice < 1 ? 6 : 2),
        }
      : null,
    ultimosTrades: lastTrades,
  };
}

export interface MarketContextInputs {
  coins: CoinMarketData[] | undefined;
  fearGreed: FearGreedResponse | undefined;
  btcCandles4h: Candle[] | undefined;
  btcCandles1d: Candle[] | undefined;
  balance: number;
  positions: Position[];
  history: ClosedTrade[];
}

/**
 * Compact, always-available market snapshot injected into every chat request
 * regardless of which page the user is on — separate from the per-page
 * "verified data" snapshot each section publishes.
 */
export function buildMarketContextSnapshot(inputs: MarketContextInputs): Record<string, unknown> {
  const btc = inputs.coins?.find((c) => c.symbol === "BTC");
  const trx = inputs.coins?.find((c) => c.symbol === "TRX");

  return {
    btc: btc
      ? { precio: round(btc.price, 2), cambio24h: btc.change24h !== null ? round(btc.change24h, 2) : null, distanciaAlAthPercent: round(btc.athChangePercent, 1) }
      : null,
    trx: trx
      ? { precio: round(trx.price, 6), cambio24h: trx.change24h !== null ? round(trx.change24h, 2) : null, distanciaAlAthPercent: round(trx.athChangePercent, 1) }
      : null,
    fearGreed: inputs.fearGreed ? { valor: inputs.fearGreed.value, clasificacion: inputs.fearGreed.classification } : null,
    fractalesBtc: [...summarizeFractals(inputs.btcCandles4h, "4h"), ...summarizeFractals(inputs.btcCandles1d, "1d")],
    alligatorBtc4h: summarizeAlligator(inputs.btcCandles4h),
    cuentaTerminal: summarizeAccount(inputs.balance, inputs.positions, inputs.history),
  };
}
