export type MarketZone = "compra" | "neutral" | "venta";

export interface ZoneReading {
  zone: MarketZone;
  message: string;
}

/**
 * Combines Fear & Greed with distance-to-ATH into a simple "buy zone / neutral / sell zone"
 * reading. This is contextual framing, not a trading signal — always paired with the NFA disclaimer.
 */
export function computeMarketZone(fearGreedValue: number, avgAthChangePercent: number): ZoneReading {
  const farFromAth = avgAthChangePercent <= -35;
  const nearAth = avgAthChangePercent >= -12;

  if (fearGreedValue <= 30 && farFromAth) {
    return {
      zone: "compra",
      message:
        "El mercado muestra miedo extremo o miedo, y el precio está considerablemente lejos de su máximo histórico. Históricamente, esta combinación ha coincidido con zonas de acumulación de largo plazo.",
    };
  }

  if (fearGreedValue >= 70 && nearAth) {
    return {
      zone: "venta",
      message:
        "El mercado muestra codicia o codicia extrema, con el precio cerca de su máximo histórico. Históricamente, esta combinación ha coincidido con zonas de mayor riesgo de corrección.",
    };
  }

  return {
    zone: "neutral",
    message:
      "El sentimiento de mercado y la distancia al máximo histórico no muestran una combinación extrema en ningún sentido — contexto mixto, sin sesgo claro.",
  };
}
