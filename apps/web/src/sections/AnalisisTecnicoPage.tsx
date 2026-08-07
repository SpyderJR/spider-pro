import { useState, type ReactNode } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { CandlestickChart } from "../components/charts/CandlestickChart";
import { IndicatorPaneChart } from "../components/charts/IndicatorPaneChart";
import { TokenSearchBox } from "../components/TokenSearchBox";
import { IndicatorAcademy } from "../components/IndicatorAcademy";
import { useKlines } from "../hooks/useMarketData";
import { useIndicatorWorker } from "../hooks/useIndicatorWorker";
import { usePublishContext } from "../hooks/usePublishContext";
import { useIndicatorConfigStore, BTC_TOKEN, TRX_TOKEN } from "../store/indicatorConfigStore";
import { TIMEFRAMES, type CompositeSignal, type CrossType } from "@spider/types";
import { formatUsd, pricePrecision } from "../lib/format";
import { INDICATOR_GUIDES } from "../data/indicatorGuides";

const SIGNAL_LABEL: Record<CompositeSignal, { text: string; cls: string }> = {
  bullish: { text: "ALCISTA", cls: "text-neon-green border-neon-green/40 bg-neon-green/5" },
  neutral: { text: "NEUTRAL", cls: "text-neon-gold border-neon-gold/40 bg-neon-gold/5" },
  bearish: { text: "BAJISTA", cls: "text-neon-red border-neon-red/40 bg-neon-red/5" },
};

const CROSS_LABEL: Record<CrossType, string> = {
  golden_cross: "Golden Cross detectado — la media corta cruzó por encima de la larga.",
  death_cross: "Death Cross detectado — la media corta cruzó por debajo de la larga.",
  none: "Sin cruce de medias en la última vela.",
};

export function AnalisisTecnicoPage() {
  const { token, timeframe, config, setToken, setTimeframe, toggleIndicator, toggleMa } =
    useIndicatorConfigStore();
  const [showAcademy, setShowAcademy] = useState(false);

  const klines = useKlines(token.symbol, timeframe, 300, token.coingeckoId);
  const { result } = useIndicatorWorker(klines.data?.candles, config);

  const lastClose = klines.data?.candles.at(-1)?.close ?? null;

  usePublishContext("analisis-tecnico", {
    token: token.symbol,
    timeframe,
    lastPrice: lastClose,
    rsi: result?.rsi?.at(-1) ?? null,
    macd: result?.macd?.at(-1) ?? null,
    stochastic: result?.stochastic?.at(-1) ?? null,
    adx: result?.adx?.at(-1) ?? null,
    cross: result?.cross ?? null,
    compositeSignal: result?.compositeSignal ?? null,
    source: klines.data?.source ?? null,
  });

  const isCustomToken = token.symbol !== "BTC" && token.symbol !== "TRX";

  return (
    <div>
      <SectionHeader
        title="Análisis Técnico"
        subtitle={`Velas japonesas interactivas sobre cualquier token, con ${INDICATOR_GUIDES.length} indicadores técnicos configurables.`}
        right={
          <div className="relative rounded-xl p-[2px] overflow-hidden shrink-0">
            {!showAcademy && (
              <div
                className="absolute inset-[-60%] animate-border-spin"
                style={{ background: "conic-gradient(from 0deg, transparent 0%, #ff3b5c 12%, transparent 26%)" }}
              />
            )}
            <button
              onClick={() => setShowAcademy((v) => !v)}
              className={`group relative z-10 flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold border transition-all ${
                showAcademy
                  ? "border-neon-green/50 text-neon-green bg-void shadow-neon-green"
                  : "border-void-border text-white bg-void hover:shadow-neon-red"
              }`}
            >
              <span className="text-base">🎓</span>
              {showAcademy ? "Ocultar academia" : "Academia de Indicadores"}
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                {showAcademy ? "▲" : "▼"}
              </span>
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setToken(BTC_TOKEN)}
          className={`px-3 py-1.5 rounded-lg text-sm font-mono border ${
            token.symbol === "BTC"
              ? "border-neon-green/50 text-neon-green bg-neon-green/5"
              : "border-void-border text-slate-400"
          }`}
        >
          BTC
        </button>
        <button
          onClick={() => setToken(TRX_TOKEN)}
          className={`px-3 py-1.5 rounded-lg text-sm font-mono border ${
            token.symbol === "TRX"
              ? "border-neon-green/50 text-neon-green bg-neon-green/5"
              : "border-void-border text-slate-400"
          }`}
        >
          TRX
        </button>
        {isCustomToken && (
          <span className="px-3 py-1.5 rounded-lg text-sm font-mono border border-neon-gold/50 text-neon-gold bg-neon-gold/5">
            {token.symbol} · {token.label}
          </span>
        )}
        <TokenSearchBox onSelect={setToken} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
              timeframe === tf
                ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5"
                : "border-void-border text-slate-500"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="panel p-4 mb-4 space-y-3">
        <ToggleRow label="Tendencia" dotColor="bg-neon-blue">
          {config.movingAverages.map((ma, i) => (
            <ToggleChip key={i} active={ma.enabled} onClick={() => toggleMa(i)} label={`${ma.type}${ma.period}`} icon="〰" />
          ))}
          <ToggleChip active={config.bollinger.enabled} onClick={() => toggleIndicator("bollinger")} label="Bollinger" icon="⌇" />
          <ToggleChip active={config.vwap.enabled} onClick={() => toggleIndicator("vwap")} label="VWAP" icon="▤" />
          <ToggleChip active={config.parabolicSar.enabled} onClick={() => toggleIndicator("parabolicSar")} label="Parabolic SAR" icon="•" />
        </ToggleRow>
        <ToggleRow label="Momentum" dotColor="bg-neon-green">
          <ToggleChip active={config.rsi.enabled} onClick={() => toggleIndicator("rsi")} label="RSI" icon="◐" />
          <ToggleChip active={config.macd.enabled} onClick={() => toggleIndicator("macd")} label="MACD" icon="≈" />
          <ToggleChip active={config.stochastic.enabled} onClick={() => toggleIndicator("stochastic")} label="Estocástico" icon="↯" />
          <ToggleChip active={config.williamsR.enabled} onClick={() => toggleIndicator("williamsR")} label="Williams %R" icon="↕" />
          <ToggleChip active={config.cci.enabled} onClick={() => toggleIndicator("cci")} label="CCI" icon="⟡" />
          <ToggleChip active={config.roc.enabled} onClick={() => toggleIndicator("roc")} label="ROC" icon="↗" />
        </ToggleRow>
        <ToggleRow label="Fuerza / Volumen" dotColor="bg-neon-red">
          <ToggleChip active={config.adx.enabled} onClick={() => toggleIndicator("adx")} label="ADX" icon="△" />
          <ToggleChip active={config.obv.enabled} onClick={() => toggleIndicator("obv")} label="OBV" icon="▮" />
          <ToggleChip active={config.mfi.enabled} onClick={() => toggleIndicator("mfi")} label="MFI" icon="◈" />
        </ToggleRow>
      </div>

      {result && (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className={`panel border p-4 ${SIGNAL_LABEL[result.compositeSignal].cls}`}>
            <div className="text-xs font-mono font-bold tracking-widest mb-1">SEÑAL COMPUESTA</div>
            <div className="text-lg font-bold">{SIGNAL_LABEL[result.compositeSignal].text}</div>
            <div className="text-xs text-slate-400 mt-1">
              Requiere confluencia de al menos 2 de 3 indicadores.
            </div>
          </div>
          <div className="panel p-4 border border-void-border">
            <div className="text-xs font-mono text-slate-500 tracking-widest mb-1">CRUCE DE MEDIAS</div>
            <div className="text-sm text-slate-200">{CROSS_LABEL[result.cross]}</div>
          </div>
        </div>
      )}

      {klines.isLoading && <div className="panel p-8 text-center text-slate-500 text-sm">Cargando velas…</div>}
      {klines.isError && (
        <div className="panel p-8 text-center text-sm">
          <div className="text-neon-red font-mono mb-1">No se encontraron velas para {token.symbol}</div>
          <p className="text-slate-500">
            Puede que este token no tenga suficiente liquidez en Binance/Bybit. Prueba con otra búsqueda.
          </p>
        </div>
      )}

      {klines.data && (
        <div className="panel p-4 mb-4">
          <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-500">
            <span>
              {token.symbol} · {timeframe} · fuente: {klines.data.source}
            </span>
            {lastClose && (
              <span className="value-mono text-slate-200">{formatUsd(lastClose, pricePrecision(lastClose))}</span>
            )}
          </div>
          <CandlestickChart
            candles={klines.data.candles}
            movingAverages={result?.movingAverages}
            bollinger={config.bollinger.enabled ? result?.bollinger : null}
            vwap={config.vwap.enabled ? result?.vwap : null}
            parabolicSar={config.parabolicSar.enabled ? result?.parabolicSar : null}
          />
        </div>
      )}

      {klines.data && result && (
        <div className="space-y-4 mb-6">
          {config.rsi.enabled && result.rsi && (
            <Pane title={`RSI (${config.rsi.period})`}>
              <IndicatorPaneChart kind="line" candles={klines.data.candles} values={result.rsi} color="#3ba8ff" refLines={[30, 70]} />
            </Pane>
          )}
          {config.macd.enabled && result.macd && (
            <Pane title="MACD">
              <IndicatorPaneChart kind="histogram" candles={klines.data.candles} macd={result.macd} />
            </Pane>
          )}
          {config.stochastic.enabled && result.stochastic && (
            <Pane title="Estocástico (%K / %D)">
              <IndicatorPaneChart
                kind="multi"
                candles={klines.data.candles}
                lines={[
                  { label: "%K", color: "#3ba8ff", values: result.stochastic.map((p) => p.k) },
                  { label: "%D", color: "#ffcf4d", values: result.stochastic.map((p) => p.d) },
                ]}
                refLines={[20, 80]}
              />
            </Pane>
          )}
          {config.williamsR.enabled && result.williamsR && (
            <Pane title={`Williams %R (${config.williamsR.period})`}>
              <IndicatorPaneChart kind="line" candles={klines.data.candles} values={result.williamsR} color="#f472b6" refLines={[-20, -80]} />
            </Pane>
          )}
          {config.cci.enabled && result.cci && (
            <Pane title={`CCI (${config.cci.period})`}>
              <IndicatorPaneChart kind="line" candles={klines.data.candles} values={result.cci} color="#a78bfa" refLines={[100, -100]} />
            </Pane>
          )}
          {config.adx.enabled && result.adx && (
            <Pane title={`ADX (${config.adx.period}) con +DI / -DI`}>
              <IndicatorPaneChart
                kind="multi"
                candles={klines.data.candles}
                lines={[
                  { label: "ADX", color: "#ffcf4d", values: result.adx.map((p) => p.adx) },
                  { label: "+DI", color: "#39ff9c", values: result.adx.map((p) => p.plusDI) },
                  { label: "-DI", color: "#ff3b5c", values: result.adx.map((p) => p.minusDI) },
                ]}
                refLines={[25]}
              />
            </Pane>
          )}
          {config.roc.enabled && result.roc && (
            <Pane title={`ROC (${config.roc.period})`}>
              <IndicatorPaneChart kind="line" candles={klines.data.candles} values={result.roc} color="#39ff9c" refLines={[0]} />
            </Pane>
          )}
          {config.mfi.enabled && result.mfi && (
            <Pane title={`MFI (${config.mfi.period})`}>
              <IndicatorPaneChart kind="line" candles={klines.data.candles} values={result.mfi} color="#3ba8ff" refLines={[20, 80]} />
            </Pane>
          )}
          {config.obv.enabled && result.obv && (
            <Pane title="OBV (On-Balance Volume)">
              <IndicatorPaneChart kind="line" candles={klines.data.candles} values={result.obv} color="#ffcf4d" />
            </Pane>
          )}
        </div>
      )}

      {showAcademy && <IndicatorAcademy />}

      <Disclaimer />
    </div>
  );
}

function Pane({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="panel p-4">
      <div className="text-xs font-mono text-slate-500 mb-2">{title}</div>
      {children}
    </div>
  );
}

function ToggleRow({ label, dotColor, children }: { label: string; dotColor: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 w-32 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {label.toUpperCase()}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
        active
          ? "border-neon-green/50 text-neon-green bg-neon-green/10 shadow-neon-green"
          : "border-void-border text-slate-500 hover:border-slate-600 hover:text-slate-300"
      }`}
    >
      <span className="text-[13px] leading-none">{icon}</span>
      {label}
    </button>
  );
}
