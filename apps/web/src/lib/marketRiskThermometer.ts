export type RiskLevel = "bajo" | "medio" | "alto";

export interface RiskThermometerResult {
  level: RiskLevel;
  volatilityPercent: number;
  fundingRatePercent: number; // por 8h, en %
  message: string;
}

const HIGH_VOL_THRESHOLD_PERCENT = 4; // rango diario promedio
const HIGH_FUNDING_THRESHOLD_PERCENT = 0.03; // por período de 8h (~33% anualizado)

/** Combina volatilidad reciente + funding rate en una lectura simple de riesgo de mercado. */
export function computeRiskThermometer(avgDailyRangePercent: number, fundingRate: number): RiskThermometerResult {
  const fundingRatePercent = fundingRate * 100;
  const highVol = avgDailyRangePercent >= HIGH_VOL_THRESHOLD_PERCENT;
  const highFunding = Math.abs(fundingRatePercent) >= HIGH_FUNDING_THRESHOLD_PERCENT;

  let level: RiskLevel = "bajo";
  if (highVol && highFunding) level = "alto";
  else if (highVol || highFunding) level = "medio";

  const volText = highVol
    ? `la volatilidad reciente de BTC (±${avgDailyRangePercent.toFixed(1)}% diario en promedio) está por encima de lo normal`
    : `la volatilidad reciente de BTC (±${avgDailyRangePercent.toFixed(1)}% diario en promedio) está en niveles normales`;

  const fundingText =
    fundingRatePercent > HIGH_FUNDING_THRESHOLD_PERCENT
      ? "el funding de futuros está elevado y positivo — hay más gente pagando por mantener largos apalancados de lo normal, lo que históricamente precede liquidaciones en cascada de posiciones largas ante caídas bruscas"
      : fundingRatePercent < -HIGH_FUNDING_THRESHOLD_PERCENT
        ? "el funding de futuros está elevado y negativo — hay más gente pagando por mantener cortos apalancados de lo normal, lo que históricamente precede liquidaciones en cascada de posiciones cortas ante subas bruscas"
        : "el funding de futuros está cerca de neutral, sin un sesgo fuerte de apalancamiento en ninguna dirección por ahora";

  const message = `${volText.charAt(0).toUpperCase()}${volText.slice(1)}, y ${fundingText}.`;

  return { level, volatilityPercent: avgDailyRangePercent, fundingRatePercent, message };
}
