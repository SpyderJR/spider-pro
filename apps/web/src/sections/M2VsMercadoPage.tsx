import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { StatCard } from "../components/StatCard";
import { DualAxisChart } from "../components/charts/DualAxisChart";
import { ToolExplainer } from "../components/tools/ToolExplainer";
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

      <ToolExplainer
        whatItMeasures={
          <>
            M2 es la medida amplia de la oferta monetaria de EE. UU. que publica la Reserva Federal (serie
            M2SL, mensual): efectivo en circulación + depósitos a la vista (cuentas corrientes) + ahorros +
            depósitos a plazo pequeños + fondos de money market minoristas. En criptografía "oferta monetaria"
            significa la cantidad total de dólares circulando en la economía real — cuantos más dólares
            existen sin que haya más bienes para comprar con ellos, más dólares terminan buscando dónde
            "estacionarse", y parte de eso históricamente llega a activos de riesgo como acciones y cripto.
          </>
        }
        howToRead={
          <>
            El gráfico muestra M2 (eje izquierdo, en miles de millones de USD) contra el precio de {asset}{" "}
            (eje derecho, escala logarítmica) en la misma ventana de tiempo. No mirés si ambas líneas
            coinciden vela a vela — M2 es un dato <strong>mensual</strong> y se mueve mucho más lento que el
            precio. Lo que importa es la <strong>dirección y la pendiente</strong> de M2 en periodos de varios
            meses: ¿está acelerando hacia arriba, plana, o cayendo? Y compará esa pendiente contra la
            tendencia de fondo del precio, no contra el ruido diario.
          </>
        }
        example={
          <>
            En 2020–2021, la Fed expandió M2 a un ritmo histórico (estímulo por la pandemia) y ese mismo
            periodo coincidió con el mercado alcista de cripto más fuerte hasta la fecha. En 2022, M2
            registró su primera contracción interanual en más de 60 años (endurecimiento monetario / suba de
            tasas) — coincidiendo con el mercado bajista de cripto de ese año. Ninguno de los dos casos
            prueba causalidad directa, pero es el ejemplo histórico que más se cita para esta comparación.
          </>
        }
        whenToUse={
          <>
            Usalo como <strong>contexto macro de fondo</strong> — para entender si el "viento" general de
            liquidez está a favor o en contra de activos de riesgo en un horizonte de meses/años, no para
            decidir una entrada o salida puntual. No lo uses como señal de trading de corto plazo: el dato es
            mensual, llega con rezago, y hay muchos otros factores (tasas de interés, regulación, adopción,
            sentimiento) que también mueven el precio. Combinalo con el resto de las herramientas de Radar de
            Trading para el timing de corto plazo.
          </>
        }
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

      {m2ChangePercent !== null && (
        <div
          className={`panel p-5 mb-6 border ${
            m2ChangePercent >= 0 ? "border-neon-green/30" : "border-neon-red/30"
          }`}
        >
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-1.5">
            LECTURA ACTUAL
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            En la ventana visible, M2 {m2ChangePercent >= 0 ? "subió" : "cayó"}{" "}
            <span className={`value-mono font-bold ${m2ChangePercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
              {formatPercent(m2ChangePercent)}
            </span>
            . {m2ChangePercent >= 0
              ? "Un M2 en expansión históricamente se interpretó como viento de cola de mediano plazo para activos de riesgo — pero el efecto llega con meses de rezago, no de forma inmediata."
              : "Un M2 en contracción o desacelerando históricamente se interpretó como viento en contra para activos de riesgo — otra vez, con rezago, no como señal de entrada/salida inmediata."}
          </p>
        </div>
      )}

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-3">Cómo usarlo en la práctica — guía rápida</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-void-soft rounded-lg p-4 border border-neon-green/20">
            <div className="text-xs font-mono font-bold text-neon-green mb-1.5">M2 ACELERANDO AL ALZA</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contexto macro favorable para activos de riesgo en un horizonte de meses. No es luz verde para
              apalancarse ni ignorar tu gestión de riesgo — es una variable más a favor.
            </p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border">
            <div className="text-xs font-mono font-bold text-slate-300 mb-1.5">M2 PLANA O ESTABLE</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contexto macro neutral — el precio probablemente se está moviendo por otros factores
              (adopción, regulación, ciclos internos de cripto, sentimiento). El análisis técnico pesa más
              acá que la macro.
            </p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-neon-red/20">
            <div className="text-xs font-mono font-bold text-neon-red mb-1.5">M2 DESACELERANDO O CAYENDO</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contexto macro adverso de mediano plazo. Es un buen momento para ser más conservador con el
              tamaño de posición y el apalancamiento, no para "apostar en contra" del mercado sin más
              confirmación.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          La comparación se limita a los últimos {WINDOW_DAYS} días porque es la ventana máxima que expone la
          API pública de precios usada por la app (M2 en sí tiene historia mensual desde 1959, publicada por
          la Reserva Federal vía FRED).
        </p>
      </div>

      <Disclaimer text="La correlación histórica entre M2 y el precio de los activos no implica causalidad garantizada, y el efecto (si existe) llega con meses de rezago. Esto es contexto macro educativo, no una señal de trading ni recomendación de inversión (NFA)." />
    </div>
  );
}
