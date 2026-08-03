import { useMemo } from "react";
import { rsi, macd } from "@spider/indicators";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { Disclaimer } from "../components/Disclaimer";
import { SpiderGauge } from "../components/spider/SpiderGauge";
import { ExplainButton } from "../components/spider/ExplainButton";
import {
  useFearGreed,
  useFearGreedHistory,
  useMarketCoins,
  useKlines,
  useM2,
} from "../hooks/useMarketData";
import { useFundingRate } from "../hooks/useFundingRate";
import { useHistoricalAnalogOutcome } from "../hooks/useHistoricalAnalogOutcome";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent, formatUsd, formatDate } from "../lib/format";
import { computeSpiderScore, type SpiderSignal } from "../lib/spiderScore";
import { buildSpiderNarrative } from "../lib/spiderNarrative";
import { findHistoricalAnalog } from "../lib/spiderHistoricalAnalog";
import { computeRiskThermometer } from "../lib/marketRiskThermometer";
import { Link } from "react-router-dom";

const ZONE_STYLES = {
  compra: { label: "ZONA DE ACUMULACIÓN", cls: "text-neon-green border-neon-green/40 bg-neon-green/5" },
  neutral: { label: "ZONA NEUTRAL", cls: "text-neon-gold border-neon-gold/40 bg-neon-gold/5" },
  venta: { label: "ZONA DE CAUTELA", cls: "text-neon-red border-neon-red/40 bg-neon-red/5" },
};

const FG_CLASS_LABEL: Record<string, string> = {
  extreme_fear: "Miedo extremo",
  fear: "Miedo",
  neutral: "Neutral",
  greed: "Codicia",
  extreme_greed: "Codicia extrema",
};

const RISK_LEVEL_STYLES: Record<string, { label: string; cls: string }> = {
  bajo: { label: "RIESGO BAJO", cls: "text-neon-green border-neon-green/40 bg-neon-green/5" },
  medio: { label: "RIESGO MEDIO", cls: "text-neon-gold border-neon-gold/40 bg-neon-gold/5" },
  alto: { label: "RIESGO ALTO", cls: "text-neon-red border-neon-red/40 bg-neon-red/5" },
};

function voteIcon(vote: -1 | 0 | 1) {
  if (vote === 1) return { icon: "▲", cls: "text-neon-green" };
  if (vote === -1) return { icon: "▼", cls: "text-neon-red" };
  return { icon: "▬", cls: "text-slate-500" };
}

function timeframeDotColor(val: number | null | undefined): string {
  if (val === null || val === undefined) return "bg-slate-700";
  if (val >= 2) return "bg-neon-green";
  if (val <= -2) return "bg-neon-red";
  return "bg-neon-gold";
}

export function SpiderIntelligencePage() {
  const fearGreed = useFearGreed();
  const fearGreedHistory = useFearGreedHistory();
  const coins = useMarketCoins();
  const btcKlines = useKlines("BTC", "1d", 60);
  const trxKlines = useKlines("TRX", "1d", 60);
  const m2 = useM2();
  const fundingRate = useFundingRate("BTCUSDT");

  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");
  const trx = coins.data?.coins.find((c) => c.symbol === "TRX");

  const avgAthChange = btc && trx ? (btc.athChangePercent + trx.athChangePercent) / 2 : null;

  const btcCloses = useMemo(() => btcKlines.data?.candles.map((c) => c.close) ?? [], [btcKlines.data]);
  const trxCloses = useMemo(() => trxKlines.data?.candles.map((c) => c.close) ?? [], [trxKlines.data]);

  const btcRsiLast = useMemo(() => (btcCloses.length >= 15 ? rsi(btcCloses, 14).at(-1) ?? null : null), [btcCloses]);
  const trxRsiLast = useMemo(() => (trxCloses.length >= 15 ? rsi(trxCloses, 14).at(-1) ?? null : null), [trxCloses]);
  const btcMacdHistLast = useMemo(
    () => (btcCloses.length >= 35 ? macd(btcCloses).at(-1)?.histogram ?? null : null),
    [btcCloses],
  );
  const trxMacdHistLast = useMemo(
    () => (trxCloses.length >= 35 ? macd(trxCloses).at(-1)?.histogram ?? null : null),
    [trxCloses],
  );

  const avgDailyRangePercent = useMemo(() => {
    const recent = (btcKlines.data?.candles ?? []).slice(-14);
    if (recent.length === 0) return 3;
    return recent.reduce((s, c) => s + ((c.high - c.low) / c.close) * 100, 0) / recent.length;
  }, [btcKlines.data]);

  const m2TrendPercent = useMemo(() => {
    const points = m2.data?.points ?? [];
    if (points.length < 2) return null;
    const latest = points.at(-1)!.m2;
    const prior = points[Math.max(0, points.length - 7)]!.m2;
    return prior ? ((latest - prior) / prior) * 100 : null;
  }, [m2.data]);

  const signals: SpiderSignal[] = useMemo(() => {
    const list: SpiderSignal[] = [];

    list.push({
      id: "fear-greed",
      label: "Fear & Greed",
      reading: fearGreed.data ? `${fearGreed.data.value} (${FG_CLASS_LABEL[fearGreed.data.classification] ?? fearGreed.data.classification})` : "—",
      vote: fearGreed.data ? (fearGreed.data.value <= 25 ? 1 : fearGreed.data.value >= 75 ? -1 : 0) : 0,
      explanation: "Sentimiento agregado del mercado cripto. Miedo extremo históricamente coincidió con zonas de acumulación; codicia extrema, con mayor riesgo de corrección.",
    });

    list.push({
      id: "ath-distance",
      label: "Distancia al ATH (BTC+TRX)",
      reading: avgAthChange !== null ? formatPercent(avgAthChange, false) : "—",
      vote: avgAthChange !== null ? (avgAthChange <= -35 ? 1 : avgAthChange >= -12 ? -1 : 0) : 0,
      explanation: "Promedio de la distancia de BTC y TRX a su máximo histórico. Muy lejos del ATH ha coincidido con zonas de acumulación; muy cerca, con mayor riesgo de corrección.",
      link: "/app/bitcoin",
    });

    list.push({
      id: "rsi-btc",
      label: "RSI 14 BTC (diario)",
      reading: btcRsiLast !== null ? btcRsiLast.toFixed(0) : "—",
      vote: btcRsiLast !== null ? (btcRsiLast < 30 ? 1 : btcRsiLast > 70 ? -1 : 0) : 0,
      explanation: "Por debajo de 30 indica sobreventa (posible rebote); por encima de 70, sobrecompra (posible corrección).",
      link: "/app/analisis-tecnico",
    });

    list.push({
      id: "rsi-trx",
      label: "RSI 14 TRX (diario)",
      reading: trxRsiLast !== null ? trxRsiLast.toFixed(0) : "—",
      vote: trxRsiLast !== null ? (trxRsiLast < 30 ? 1 : trxRsiLast > 70 ? -1 : 0) : 0,
      explanation: "Misma lectura que el RSI de BTC, aplicada a TRX de forma independiente.",
      link: "/app/analisis-tecnico",
    });

    list.push({
      id: "macd-btc",
      label: "Momentum MACD BTC",
      reading: btcMacdHistLast !== null ? (btcMacdHistLast > 0 ? "Positivo" : btcMacdHistLast < 0 ? "Negativo" : "Neutral") : "—",
      vote: btcMacdHistLast !== null ? (btcMacdHistLast > 0 ? 1 : btcMacdHistLast < 0 ? -1 : 0) : 0,
      explanation: "Histograma MACD positivo indica momentum alcista de corto plazo; negativo, momentum bajista.",
      link: "/app/analisis-tecnico",
    });

    list.push({
      id: "macd-trx",
      label: "Momentum MACD TRX",
      reading: trxMacdHistLast !== null ? (trxMacdHistLast > 0 ? "Positivo" : trxMacdHistLast < 0 ? "Negativo" : "Neutral") : "—",
      vote: trxMacdHistLast !== null ? (trxMacdHistLast > 0 ? 1 : trxMacdHistLast < 0 ? -1 : 0) : 0,
      explanation: "Misma lectura que el MACD de BTC, aplicada a TRX de forma independiente.",
      link: "/app/analisis-tecnico",
    });

    list.push({
      id: "m2-trend",
      label: "Tendencia M2 (liquidez macro)",
      reading: m2TrendPercent !== null ? formatPercent(m2TrendPercent) : "—",
      vote: m2TrendPercent !== null ? (m2TrendPercent > 0.5 ? 1 : m2TrendPercent < -0.5 ? -1 : 0) : 0,
      explanation: "M2 en expansión históricamente se leyó como viento de cola para activos de riesgo; en contracción, como viento en contra.",
      link: "/app/m2-vs-mercado",
    });

    return list;
  }, [fearGreed.data, avgAthChange, btcRsiLast, trxRsiLast, btcMacdHistLast, trxMacdHistLast, m2TrendPercent]);

  const scoreResult = useMemo(() => computeSpiderScore(signals), [signals]);

  const narrative = useMemo(
    () =>
      buildSpiderNarrative({
        zone: scoreResult.zone,
        bullishLabels: signals.filter((s) => s.vote === 1).map((s) => s.label),
        bearishLabels: signals.filter((s) => s.vote === -1).map((s) => s.label),
        totalSignals: signals.length,
        fearGreedValue: fearGreed.data?.value ?? null,
        athDistancePercent: avgAthChange,
      }),
    [scoreResult, signals, fearGreed.data, avgAthChange],
  );

  const historicalAnalog = useMemo(() => {
    if (!fearGreed.data || !fearGreedHistory.data) return null;
    return findHistoricalAnalog(fearGreed.data.value, fearGreed.data.classification, fearGreedHistory.data.points);
  }, [fearGreed.data, fearGreedHistory.data]);

  const analogOutcome = useHistoricalAnalogOutcome(historicalAnalog?.time ?? null);

  const riskThermometer = useMemo(
    () => computeRiskThermometer(avgDailyRangePercent, fundingRate.data ?? 0.0001),
    [avgDailyRangePercent, fundingRate.data],
  );

  usePublishContext("spider-intelligence", {
    fearGreedValue: fearGreed.data?.value ?? null,
    fearGreedClassification: fearGreed.data?.classification ?? null,
    btcPrice: btc?.price ?? null,
    trxPrice: trx?.price ?? null,
    spiderScore: scoreResult.score,
    zone: scoreResult.zone,
    riskLevel: riskThermometer.level,
  });

  return (
    <div>
      <SectionHeader
        title="Spider Intelligence"
        subtitle="El motor de señales de Spider Pro — combina sentimiento, distancia al máximo histórico, momentum técnico y liquidez macro en una sola lectura, 100% basada en reglas fijas y sin IA de por medio."
      />

      {/* Hero: Spider Score */}
      <div className={`panel border p-6 mb-6 relative overflow-hidden ${ZONE_STYLES[scoreResult.zone].cls}`}>
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="spider-net" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.4" fill="currentColor" />
                <line x1="4" y1="4" x2="40" y2="30" stroke="currentColor" strokeWidth="0.5" />
                <line x1="4" y1="4" x2="10" y2="50" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spider-net)" />
          </svg>
        </div>

        <div className="relative grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex flex-col items-center">
            <SpiderGauge score={scoreResult.score} />
            <div className="text-3xl font-bold value-mono -mt-2">{scoreResult.score.toFixed(0)}</div>
            <div className="text-[10px] font-mono tracking-widest text-slate-500">SPIDER SCORE</div>
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest mb-2">{ZONE_STYLES[scoreResult.zone].label}</div>
            <p className="text-slate-200 text-sm leading-relaxed mb-2">{narrative}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] font-mono text-slate-500">
                {scoreResult.bullishCount} a favor · {scoreResult.neutralCount} neutrales · {scoreResult.bearishCount} en contra
              </span>
              <ExplainButton question="¿Qué es el Spider Score y cómo se calcula? Explicame la zona actual del mercado." />
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de señales */}
      <div className="mb-8">
        <div className="font-semibold text-white mb-3">Desglose de señales — así se armó el score de arriba</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {signals.map((s) => {
            const { icon, cls } = voteIcon(s.vote);
            return (
              <div key={s.id} className="panel p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] font-mono text-slate-500 tracking-wide">{s.label.toUpperCase()}</div>
                  <span className={`value-mono font-bold ${cls}`}>{icon}</span>
                </div>
                <div className="value-mono text-lg font-bold text-slate-100 mb-1.5">{s.reading}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{s.explanation}</p>
                {s.link && (
                  <Link to={s.link} className="text-[10px] font-mono text-neon-blue hover:underline">
                    → Profundizar
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparación histórica */}
      <div className="panel p-5 mb-8">
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-white">¿Cuándo se vio esto antes?</div>
          <ExplainButton question="¿Por qué es útil comparar el sentimiento de mercado actual con momentos históricos parecidos?" />
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Comparación con el historial real de Fear & Greed (alternative.me, desde 2018) y el precio real de BTC en Binance — no es una predicción, es lo que pasó la vez anterior que se vio una lectura parecida.
        </p>
        {!fearGreedHistory.data || !fearGreed.data ? (
          <div className="text-sm text-slate-500 py-6 text-center">Cargando historial de sentimiento…</div>
        ) : !historicalAnalog ? (
          <div className="text-sm text-slate-500 py-6 text-center">
            No se encontró una ocurrencia histórica suficientemente parecida a la lectura actual.
          </div>
        ) : (
          <div className="bg-void-soft rounded-lg p-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              La última vez que el Fear & Greed estuvo en <strong className="text-white">{historicalAnalog.value}</strong>{" "}
              ({FG_CLASS_LABEL[historicalAnalog.classification] ?? historicalAnalog.classification}) —una lectura
              parecida a la actual ({fearGreed.data.value})— fue el{" "}
              <strong className="text-white">{formatDate(historicalAnalog.time)}</strong>.
            </p>
            {analogOutcome.isLoading && (
              <p className="text-xs text-slate-500 mt-2">Calculando qué pasó con el precio de BTC después…</p>
            )}
            {analogOutcome.data && (
              <p className="text-sm text-slate-300 leading-relaxed mt-2">
                En los <strong className="text-white">{analogOutcome.data.days} días</strong> siguientes, BTC pasó de{" "}
                <span className="value-mono text-slate-200">{formatUsd(analogOutcome.data.startPrice, 0)}</span> a{" "}
                <span className="value-mono text-slate-200">{formatUsd(analogOutcome.data.endPrice, 0)}</span> —{" "}
                <span className={`value-mono font-bold ${analogOutcome.data.changePercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                  {formatPercent(analogOutcome.data.changePercent)}
                </span>
                . Un solo caso histórico no es una muestra estadística — es un dato de contexto, no una garantía de que se repita.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Termómetro de riesgo */}
      <div className={`panel border p-5 mb-8 ${RISK_LEVEL_STYLES[riskThermometer.level]!.cls}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono font-bold tracking-widest">{RISK_LEVEL_STYLES[riskThermometer.level]!.label}</div>
          <Link to="/app/contratos" className="text-[10px] font-mono text-neon-blue hover:underline">
            → Ver Contratos y Apalancamiento
          </Link>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{riskThermometer.message}</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-500 mb-1">VOLATILIDAD DIARIA PROM. (14d)</div>
            <div className="value-mono text-sm font-semibold text-slate-200">±{riskThermometer.volatilityPercent.toFixed(2)}%</div>
          </div>
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-500 mb-1">FUNDING RATE BTC (8h)</div>
            <div className={`value-mono text-sm font-semibold ${riskThermometer.fundingRatePercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
              {riskThermometer.fundingRatePercent >= 0 ? "+" : ""}
              {riskThermometer.fundingRatePercent.toFixed(4)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Fear & Greed"
          value={fearGreed.data ? fearGreed.data.value : "—"}
          sub={fearGreed.data?.classification.replace("_", " ")}
          accent="gold"
        />
        <StatCard
          label="BTC precio"
          value={btc ? formatUsd(btc.price) : "—"}
          sub={btc ? formatPercent(btc.change24h ?? 0) + " (24h)" : undefined}
          accent={btc && (btc.change24h ?? 0) >= 0 ? "green" : "red"}
        />
        <StatCard
          label="TRX precio"
          value={trx ? formatUsd(trx.price, 5) : "—"}
          sub={trx ? formatPercent(trx.change24h ?? 0) + " (24h)" : undefined}
          accent={trx && (trx.change24h ?? 0) >= 0 ? "green" : "red"}
        />
        <StatCard
          label="Distancia media al ATH"
          value={avgAthChange !== null ? formatPercent(avgAthChange, false) : "—"}
          accent="blue"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Bitcoin", coin: btc },
          { label: "TRON", coin: trx },
        ].map(({ label, coin }) => (
          <div key={label} className="panel p-5">
            <div className="font-semibold text-white mb-3">{label} — semáforo por temporalidad</div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {(
                [
                  ["1h", coin?.change1h],
                  ["24h", coin?.change24h],
                  ["7d", coin?.change7d],
                  ["30d", coin?.change30d],
                  ["1a", coin?.change1y],
                ] as const
              ).map(([tf, val]) => (
                <div key={tf} className="bg-void-soft rounded-lg py-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${timeframeDotColor(val)}`} />
                    <span className="text-[10px] text-slate-500">{tf}</span>
                  </div>
                  <div
                    className={`value-mono text-xs font-semibold ${
                      val === null || val === undefined
                        ? "text-slate-600"
                        : val >= 0
                          ? "text-neon-green"
                          : "text-neon-red"
                    }`}
                  >
                    {val === null || val === undefined ? "—" : formatPercent(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-2">Cómo funciona el Spider Score — sin caja negra</div>
        <p className="text-sm text-slate-400 leading-relaxed">
          El Spider Score cuenta, con el mismo peso cada una, cuántas de las {signals.length} señales de arriba
          están en su extremo alcista (▲), neutral (▬) o bajista (▼) según un umbral fijo y público para cada
          una — los mismos umbrales que se explican en cada tarjeta. El resultado se normaliza a un número entre
          0 y 100: 65+ es zona de acumulación, 35 o menos es zona de cautela, y el resto es neutral. No hay
          modelo de IA, red neuronal ni entrenamiento detrás — es aritmética simple y transparente, igual que el
          resto de las herramientas educativas de Spider Pro.
        </p>
      </div>

      <Disclaimer text="El Spider Score y todas las señales de esta página son contexto educativo derivado de datos públicos, no una recomendación de inversión. Las combinaciones históricas de estas señales no garantizan que el precio se comporte igual esta vez (NFA)." />
    </div>
  );
}
