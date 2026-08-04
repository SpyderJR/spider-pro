import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { StatCard } from "../components/StatCard";
import { DualAxisChart } from "../components/charts/DualAxisChart";
import { ToolExplainer } from "../components/tools/ToolExplainer";
import { useM2, useDxy, useFedFunds, useSp500, useMarketHistory } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent } from "../lib/format";
import type { Asset, MacroPoint } from "@spider/types";

// CoinGecko's public API caps historical range at 365 days — every series is windowed to
// the same span so the price line isn't squeezed to a sliver against decades of macro history.
const WINDOW_DAYS = 365;

interface MacroSeriesQueryResult {
  data?: { points: MacroPoint[]; live: boolean; source: string };
  isLoading: boolean;
  isError: boolean;
}

function useWindowedSeries(series: MacroSeriesQueryResult, priceHistoryPoints: { time: number }[] | undefined) {
  return useMemo(() => {
    if (!series.data || !priceHistoryPoints || priceHistoryPoints.length === 0) return null;
    const earliest = priceHistoryPoints[0]!.time;
    const points = series.data.points.filter((p) => p.time >= earliest);
    return points.length >= 2 ? points : series.data.points.slice(-6);
  }, [series.data, priceHistoryPoints]);
}

function MacroSeriesSection({
  title,
  unit,
  series,
  priceHistory,
  asset,
}: {
  title: string;
  unit: string;
  series: MacroSeriesQueryResult;
  priceHistory: { time: number; price: number }[] | undefined;
  asset: Asset;
}) {
  const windowed = useWindowedSeries(series, priceHistory);
  const latest = series.data?.points.at(-1)?.value ?? null;
  const yearAgo = windowed?.[0]?.value ?? null;
  const changePercent = latest !== null && yearAgo ? ((latest - yearAgo) / yearAgo) * 100 : null;
  const hasError = series.isError;
  const isLoading = series.isLoading;

  return (
    <div className="panel p-5 mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-base font-bold text-white">{title}</h3>
        {series.data && <LiveBadge live={series.data.live} source={series.data.source} />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <StatCard label={`${title} actual`} value={latest !== null ? `${latest.toLocaleString("en-US")}${unit}` : "—"} accent="blue" />
        <StatCard
          label="Cambio (ventana visible)"
          value={changePercent !== null ? formatPercent(changePercent) : "—"}
          accent={changePercent !== null && changePercent >= 0 ? "green" : "red"}
        />
        <StatCard label="Ventana comparada" value={`${WINDOW_DAYS} días`} accent="gold" />
      </div>

      {hasError && (
        <div className="text-center text-sm py-12">
          <div className="text-neon-red font-mono mb-2">No se pudo cargar esta serie</div>
          <p className="text-slate-500 max-w-md mx-auto">FRED no respondió — el resto de la app sigue funcionando con normalidad.</p>
        </div>
      )}
      {!hasError && isLoading && <div className="text-center text-slate-500 text-sm py-12">Cargando serie…</div>}
      {!hasError && !isLoading && windowed && priceHistory && (
        <DualAxisChart
          leftSeries={windowed.map((p) => ({ time: p.time, value: p.value }))}
          rightSeries={priceHistory.map((p) => ({ time: p.time, value: p.price }))}
          leftLabel={`${title} (${unit.trim() || "unidades"})`}
          rightLabel={`${asset} (USD, log)`}
          height={260}
        />
      )}
    </div>
  );
}

export function MacroAnalysisPage() {
  const [asset, setAsset] = useState<Asset>("BTC");
  const m2 = useM2();
  const dxy = useDxy();
  const fedFunds = useFedFunds();
  const sp500 = useSp500();
  const history = useMarketHistory(asset, WINDOW_DAYS);

  const windowedM2 = useWindowedSeries(
    { data: m2.data ? { points: m2.data.points.map((p) => ({ time: p.time, value: p.m2 })), live: m2.data.live, source: m2.data.source } : undefined, isLoading: m2.isLoading, isError: m2.isError },
    history.data?.points,
  );

  const latestM2 = m2.data?.points.at(-1)?.m2 ?? null;
  const m2YearAgo = windowedM2?.[0]?.value ?? null;
  const m2ChangePercent = latestM2 !== null && m2YearAgo ? ((latestM2 - m2YearAgo) / m2YearAgo) * 100 : null;

  const hasError = m2.isError || history.isError;
  const isLoading = m2.isLoading || history.isLoading;

  usePublishContext("analisis-macro", {
    asset,
    m2Live: m2.data?.live ?? null,
    m2Source: m2.data?.source ?? null,
    latestM2Billions: latestM2,
    m2ChangePercent12m: m2ChangePercent,
    dxyLive: dxy.data?.live ?? null,
    fedFundsLive: fedFunds.data?.live ?? null,
    sp500Live: sp500.data?.live ?? null,
  });

  return (
    <div>
      <SectionHeader
        title="Análisis Macro"
        subtitle="Oferta monetaria (M2), el índice del dólar (DXY), la tasa de la Fed y el S&P 500 comparados contra el precio de BTC/TRX — para entender si cripto se mueve en una burbuja aislada o dentro del contexto financiero más amplio."
        right={m2.data && <LiveBadge live={m2.data.live} source={m2.data.source} />}
      />

      <ToolExplainer
        whatItMeasures={
          <>
            Cuatro series macroeconómicas de EE. UU. publicadas por la Reserva Federal vía FRED: M2 (oferta
            monetaria amplia), DXY (índice del dólar frente a una canasta de divisas), la tasa de fondos
            federales (el costo del dinero que fija la Fed) y el S&amp;P 500 (el índice bursátil de referencia).
            Cripto no vive en una burbuja aislada — comparte el mismo entorno de liquidez y tasas de interés
            que el resto de los activos financieros.
          </>
        }
        howToRead={
          <>
            Cada gráfico muestra la serie macro (eje izquierdo) contra el precio de {asset} (eje derecho,
            escala logarítmica) en la misma ventana. Estas series son mensuales o diarias pero se mueven mucho
            más lento que el precio de cripto — lo que importa es la <strong>dirección y la pendiente</strong>{" "}
            de varios meses, no la coincidencia vela a vela.
          </>
        }
        example={
          <>
            En 2022 la Fed subió la tasa de fondos federales al ritmo más agresivo en 40 años (de ~0% a &gt;5%)
            mientras el DXY se disparaba — ambas cosas endurecen las condiciones financieras globales, y ese
            mismo año coincidió con el mercado bajista de cripto y una caída del S&amp;P 500. Ninguna de estas
            correlaciones prueba causalidad directa, pero es el contexto que más citan los analistas macro.
          </>
        }
        whenToUse={
          <>
            Usa esto como <strong>contexto de fondo</strong>, nunca como señal de entrada/salida de corto
            plazo — el dato es lento, llega con rezago, y hay muchos otros factores (adopción, regulación,
            ciclos internos de cripto) que también mueven el precio.
          </>
        }
      />

      <div className="flex gap-2 mb-4">
        {(["BTC", "TRX"] as Asset[]).map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
              asset === a ? "border-neon-green/50 text-neon-green bg-neon-green/5 shadow-neon-green" : "border-void-border text-slate-400 hover:border-slate-600"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="panel p-4 mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,168,255,0.06),_transparent_60%)]" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <StatCard label="M2 actual" value={latestM2 !== null ? `$${latestM2.toLocaleString("en-US")}B` : "—"} accent="blue" />
          <StatCard
            label="Cambio M2 (ventana visible)"
            value={m2ChangePercent !== null ? formatPercent(m2ChangePercent) : "—"}
            accent={m2ChangePercent !== null && m2ChangePercent >= 0 ? "green" : "red"}
          />
          <StatCard label="Ventana comparada" value={`${WINDOW_DAYS} días`} accent="gold" />
        </div>
        {hasError && (
          <div className="text-center text-sm py-16">
            <div className="text-neon-red font-mono mb-2">No se pudo cargar la comparación</div>
            <p className="text-slate-500 max-w-md mx-auto">
              Uno de los proveedores de datos (FRED o CoinGecko) no respondió. Los demás datos de la app siguen
              funcionando con normalidad — prueba de nuevo en unos segundos.
            </p>
          </div>
        )}
        {!hasError && isLoading && <div className="text-center text-slate-500 text-sm py-16">Cargando series…</div>}
        {!hasError && !isLoading && windowedM2 && history.data && (
          <DualAxisChart
            leftSeries={windowedM2.map((p) => ({ time: p.time, value: p.value }))}
            rightSeries={history.data.points.map((p) => ({ time: p.time, value: p.price }))}
            leftLabel="M2 (USD, miles de millones)"
            rightLabel={`${asset} (USD, log)`}
            height={360}
          />
        )}
      </div>

      {m2ChangePercent !== null && (
        <div className={`panel p-5 mb-6 border ${m2ChangePercent >= 0 ? "border-neon-green/30" : "border-neon-red/30"}`}>
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-1.5">LECTURA ACTUAL — M2</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            En la ventana visible, M2 {m2ChangePercent >= 0 ? "subió" : "cayó"}{" "}
            <span className={`value-mono font-bold ${m2ChangePercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>{formatPercent(m2ChangePercent)}</span>.{" "}
            {m2ChangePercent >= 0
              ? "Un M2 en expansión históricamente se interpretó como viento de cola de mediano plazo para activos de riesgo — pero el efecto llega con meses de rezago, no de forma inmediata."
              : "Un M2 en contracción o desacelerando históricamente se interpretó como viento en contra para activos de riesgo — otra vez, con rezago, no como señal de entrada/salida inmediata."}
          </p>
        </div>
      )}

      <MacroSeriesSection title="DXY — Índice del dólar" unit="" series={dxy} priceHistory={history.data?.points} asset={asset} />
      <MacroSeriesSection title="Tasa de fondos federales" unit="%" series={fedFunds} priceHistory={history.data?.points} asset={asset} />
      <MacroSeriesSection title="S&P 500" unit="" series={sp500} priceHistory={history.data?.points} asset={asset} />

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-3">Cómo usarlo en la práctica — guía rápida</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-void-soft rounded-lg p-4 border border-neon-green/20">
            <div className="text-xs font-mono font-bold text-neon-green mb-1.5">LIQUIDEZ EXPANDIÉNDOSE</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              M2 subiendo, DXY y tasas bajando o estables, S&amp;P 500 en tendencia alcista: contexto macro
              favorable para activos de riesgo en un horizonte de meses. No es luz verde para apalancarse ni
              ignorar tu gestión de riesgo.
            </p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border">
            <div className="text-xs font-mono font-bold text-slate-300 mb-1.5">SEÑALES MIXTAS</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cuando las cuatro series no apuntan en la misma dirección, el contexto macro es neutral — el
              precio probablemente se mueve más por factores internos de cripto (adopción, ciclos, sentimiento)
              que por macro.
            </p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-neon-red/20">
            <div className="text-xs font-mono font-bold text-neon-red mb-1.5">LIQUIDEZ CONTRAYÉNDOSE</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              M2 cayendo, DXY y tasas subiendo, S&amp;P 500 débil: contexto macro adverso de mediano plazo. Buen
              momento para ser más conservador con el tamaño de posición y el apalancamiento.
            </p>
          </div>
        </div>
      </div>

      <Disclaimer text="La correlación histórica entre estas series macro y el precio de los activos no implica causalidad garantizada, y el efecto (si existe) llega con meses de rezago. Esto es contexto macro educativo, no una señal de trading ni recomendación de inversión (NFA)." />
    </div>
  );
}
