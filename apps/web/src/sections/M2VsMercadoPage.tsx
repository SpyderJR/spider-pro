import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { StatCard } from "../components/StatCard";
import { DualAxisChart } from "../components/charts/DualAxisChart";
import { useM2, useMarketHistory } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent } from "../lib/format";
import type { Asset } from "@spider/types";

// CoinGecko's public API caps historical range at 365 days — both series are
// windowed to the same span so the price line isn't squeezed to a sliver
// against M2's full history back to 1959.
const WINDOW_DAYS = 365;

export function M2VsMercadoPage() {
  const [asset, setAsset] = useState<Asset>("BTC");
  const m2 = useM2();
  const history = useMarketHistory(asset, WINDOW_DAYS);

  const windowedM2 = useMemo(() => {
    if (!m2.data || !history.data || history.data.points.length === 0) return null;
    const earliest = history.data.points[0]!.time;
    const points = m2.data.points.filter((p) => p.time >= earliest);
    return points.length >= 2 ? points : m2.data.points.slice(-6);
  }, [m2.data, history.data]);

  const latestM2 = m2.data?.points.at(-1)?.m2 ?? null;
  const m2YearAgo = windowedM2?.[0]?.m2 ?? null;
  const m2ChangePercent = latestM2 !== null && m2YearAgo ? ((latestM2 - m2YearAgo) / m2YearAgo) * 100 : null;

  const hasError = m2.isError || history.isError;
  const isLoading = m2.isLoading || history.isLoading;

  usePublishContext("m2-vs-mercado", {
    asset,
    m2Live: m2.data?.live ?? null,
    m2Source: m2.data?.source ?? null,
    latestM2Billions: latestM2,
    m2ChangePercent12m: m2ChangePercent,
  });

  return (
    <div>
      <SectionHeader
        title="M2 vs Mercado"
        subtitle="Oferta monetaria M2 de EE. UU. (FRED) comparada contra el precio de BTC/TRX en escala logarítmica."
        right={m2.data && <LiveBadge live={m2.data.live} source={m2.data.source} />}
      />

      <div className="flex gap-2 mb-4">
        {(["BTC", "TRX"] as Asset[]).map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
              asset === a
                ? "border-neon-green/50 text-neon-green bg-neon-green/5 shadow-neon-green"
                : "border-void-border text-slate-400 hover:border-slate-600"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          label="M2 actual"
          value={latestM2 !== null ? `$${latestM2.toLocaleString("en-US")}B` : "—"}
          accent="blue"
        />
        <StatCard
          label="Cambio M2 (ventana visible)"
          value={m2ChangePercent !== null ? formatPercent(m2ChangePercent) : "—"}
          accent={m2ChangePercent !== null && m2ChangePercent >= 0 ? "green" : "red"}
        />
        <StatCard label="Ventana comparada" value={`${WINDOW_DAYS} días`} accent="gold" />
      </div>

      <div className="panel p-4 mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,168,255,0.06),_transparent_60%)]" />
        {hasError && (
          <div className="text-center text-sm py-16">
            <div className="text-neon-red font-mono mb-2">No se pudo cargar la comparación</div>
            <p className="text-slate-500 max-w-md mx-auto">
              Uno de los proveedores de datos (FRED o CoinGecko) no respondió. Los demás datos de la app
              siguen funcionando con normalidad — probá de nuevo en unos segundos.
            </p>
          </div>
        )}
        {!hasError && isLoading && (
          <div className="text-center text-slate-500 text-sm py-16">Cargando series…</div>
        )}
        {!hasError && !isLoading && windowedM2 && history.data && (
          <DualAxisChart
            leftSeries={windowedM2.map((p) => ({ time: p.time, value: p.m2 }))}
            rightSeries={history.data.points.map((p) => ({ time: p.time, value: p.price }))}
            leftLabel="M2 (USD, miles de millones)"
            rightLabel={`${asset} (USD, log)`}
            height={360}
          />
        )}
      </div>

      <div className="panel p-5">
        <p className="text-sm text-slate-400">
          M2 mide la oferta monetaria amplia de EE. UU. (efectivo, depósitos y cuasi-dinero). Muchos
          analistas la usan como proxy de la liquidez global disponible para activos de riesgo, incluyendo
          cripto — la hipótesis es que expansiones de M2 suelen preceder o acompañar subidas de precio con
          cierto rezago. La comparación se limita a los últimos {WINDOW_DAYS} días porque es la ventana
          máxima que expone la API pública de precios.
        </p>
      </div>

      <Disclaimer text="La correlación histórica entre M2 y el precio de los activos no implica causalidad garantizada. Esto es contexto macro, no una señal de trading (NFA)." />
    </div>
  );
}
