import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { alligator } from "@spider/indicators";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { PairBar } from "../components/terminal/PairBar";
import { TerminalChart, type ExtraPriceLine } from "../components/terminal/TerminalChart";
import { TerminalOscillators } from "../components/terminal/TerminalOscillators";
import { IndicatorTogglesPanel } from "../components/terminal/IndicatorTogglesPanel";
import { OrderPanel } from "../components/terminal/OrderPanel";
import { FuturesOrderPanel } from "../components/terminal/FuturesOrderPanel";
import { OrderBookPanel } from "../components/terminal/OrderBookPanel";
import { TradesFeed } from "../components/terminal/TradesFeed";
import { ManagementTabs } from "../components/terminal/ManagementTabs";
import { FuturesManagementTabs } from "../components/terminal/FuturesManagementTabs";
import { ReplayTerminal } from "../components/terminal/replay/ReplayTerminal";
import { useBinanceKlinesQuery } from "../hooks/useBinanceKlinesQuery";
import { useBinanceStreams } from "../lib/binance/websocket";
import { useTerminalIndicators } from "../hooks/useTerminalIndicators";
import { useTerminalPreferencesStore } from "../store/terminalPreferencesStore";
import { usePaperTradingStore } from "../lib/paperTrading/store";
import { useFuturesStore } from "../store/futuresStore";
import { generateTradeFeedback, type FeedbackContext } from "../lib/tradeFeedback";
import { generateFuturesTradeFeedback, type FuturesFeedbackContext } from "../lib/futuresTradeFeedback";
import { useFearGreed } from "../hooks/useMarketData";
import { useFundingRate } from "../hooks/useFundingRate";
import { deriveAlligatorTrend } from "../lib/futures/alligatorTrend";
import { TERMINAL_INTERVALS, type BinancePair, type TerminalInterval } from "../lib/binance/types";
import type { BinanceCandle } from "../lib/binance/types";
import type { ClosedTrade } from "../lib/paperTrading/types";
import type { FuturesClosedTrade } from "../lib/futures/types";
import type { FuturesSide } from "../lib/futures/liquidation";

function isToday(timestamp: number): boolean {
  const d = new Date(timestamp);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function TerminalPage() {
  const [mode, setMode] = useState<"live" | "replay">("live");
  const [market, setMarket] = useState<"spot" | "futures">("spot");
  const [pair, setPair] = useState<BinancePair>("BTCUSDT");
  const [interval, setIntervalValue] = useState<TerminalInterval>("15m");

  const historyQuery = useBinanceKlinesQuery(pair, interval, 300);
  const dailyQuery = useBinanceKlinesQuery(pair, "1d", 15);
  const streams = useBinanceStreams(pair, interval);
  const fearGreed = useFearGreed();
  const fundingQuery = useFundingRate(pair);

  const { toggles } = useTerminalPreferencesStore();
  const store = usePaperTradingStore();
  const futuresStore = useFuturesStore();

  // Accumulates candles that finalized over the websocket since this pair/interval was
  // loaded, so indicators don't need a full REST refetch every time a candle closes.
  const [finalizedExtra, setFinalizedExtra] = useState<BinanceCandle[]>([]);
  const lastFinalTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setFinalizedExtra([]);
    lastFinalTimeRef.current = null;
  }, [pair, interval]);

  useEffect(() => {
    const k = streams.kline;
    if (!k || !k.isFinal) return;
    if (lastFinalTimeRef.current === k.time) return;
    lastFinalTimeRef.current = k.time;
    setFinalizedExtra((prev) => [
      ...prev,
      { time: k.time, open: k.open, high: k.high, low: k.low, close: k.close, volume: k.volume },
    ]);
  }, [streams.kline]);

  const baseCandles = useMemo(() => historyQuery.data ?? [], [historyQuery.data]);
  const candles = useMemo(() => {
    if (finalizedExtra.length === 0) return baseCandles;
    const lastBaseTime = baseCandles.at(-1)?.time ?? -Infinity;
    const newOnes = finalizedExtra.filter((c) => c.time > lastBaseTime);
    return newOnes.length > 0 ? [...baseCandles, ...newOnes] : baseCandles;
  }, [baseCandles, finalizedExtra]);

  const indicators = useTerminalIndicators(candles, toggles, dailyQuery.data ?? null);

  const currentPrice = streams.ticker?.lastPrice ?? candles.at(-1)?.close ?? null;
  const currentPrices = useMemo(() => ({ [pair]: currentPrice ?? undefined }), [pair, currentPrice]);

  const positionForPair = store.positions.find((p) => p.pair === pair) ?? null;
  const ordersForPair = store.orders.filter((o) => o.pair === pair);

  const dayPnl = useMemo(
    () => store.history.filter((t) => isToday(t.closedAt)).reduce((sum, t) => sum + t.pnl, 0),
    [store.history],
  );

  const [lastFeedback, setLastFeedback] = useState<ClosedTrade | null>(null);

  const buildFeedback = useCallback(
    (trade: Omit<ClosedTrade, "feedback">, balanceBeforeTrade: number) => {
      const ctx: FeedbackContext = {
        balanceBeforeTrade,
        fearGreedValue: fearGreed.data?.value ?? null,
        fearGreedClassification: fearGreed.data?.classification ?? null,
        nearbyFractals: indicators.fractals,
        fractalPrices: indicators.fractals.map((f) => f.price),
      };
      return generateTradeFeedback(trade, ctx);
    },
    [fearGreed.data, indicators.fractals],
  );

  // Feed every ticker price update into the paper trading engine so limit orders and
  // SL/TP get evaluated continuously, not just when the user has the tab focused on a trade.
  useEffect(() => {
    if (currentPrice === null) return;
    store.processTick(pair, currentPrice, buildFeedback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice, pair]);

  // Surfaces the feedback panel for EVERY close — manual, SL, or TP — not just manual
  // closes. processTick can close a position automatically without going through
  // handleClosePosition, so this watches history directly instead.
  const lastSeenSpotTradeId = useRef<string | null>(null);
  useEffect(() => {
    const top = store.history[0];
    if (top && top.id !== lastSeenSpotTradeId.current) {
      lastSeenSpotTradeId.current = top.id;
      setLastFeedback(top);
    }
  }, [store.history]);

  function handleSubmitOrder(params: {
    side: "buy" | "sell";
    orderType: "market" | "limit";
    limitPrice: number | null;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) {
    if (params.orderType === "market" && currentPrice !== null) {
      store.openMarketPosition({
        pair,
        side: params.side,
        usdAmount: params.quantity * currentPrice,
        quantity: params.quantity,
        price: currentPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
      });
    } else if (params.orderType === "limit" && params.limitPrice !== null) {
      store.placeLimitOrder({
        pair,
        side: params.side,
        quantity: params.quantity,
        limitPrice: params.limitPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
      });
    }
  }

  function handleClosePosition(id: string) {
    if (currentPrice === null) return;
    store.closePosition(id, currentPrice, "manual", buildFeedback);
  }

  // --- Futuros ---
  const futuresPositionForPair = futuresStore.positions.find((p) => p.pair === pair) ?? null;
  const futuresOrdersForPair = futuresStore.orders.filter((o) => o.pair === pair);

  const futuresDayPnl = useMemo(
    () => futuresStore.history.filter((t) => isToday(t.closedAt)).reduce((sum, t) => sum + t.pnl, 0),
    [futuresStore.history],
  );

  const alligatorTrend = useMemo(() => {
    if (candles.length < 20) return null;
    const points = alligator(candles);
    return deriveAlligatorTrend(points, candles.at(-1)?.close ?? 0);
  }, [candles]);

  const [lastFuturesFeedback, setLastFuturesFeedback] = useState<FuturesClosedTrade | null>(null);

  const buildFuturesFeedback = useCallback(
    (trade: Omit<FuturesClosedTrade, "feedback">, balanceBeforeTrade: number) => {
      const ctx: FuturesFeedbackContext = { balanceBeforeTrade, alligatorTrend };
      return generateFuturesTradeFeedback(trade, ctx);
    },
    [alligatorTrend],
  );

  useEffect(() => {
    if (market !== "futures" || currentPrice === null || fundingQuery.data === undefined) return;
    futuresStore.processTick(pair, currentPrice, fundingQuery.data, buildFuturesFeedback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice, pair, market, fundingQuery.data]);

  // Same rationale as the spot watcher above — covers manual closes, SL/TP, and liquidation alike.
  const lastSeenFuturesTradeId = useRef<string | null>(null);
  useEffect(() => {
    const top = futuresStore.history[0];
    if (top && top.id !== lastSeenFuturesTradeId.current) {
      lastSeenFuturesTradeId.current = top.id;
      setLastFuturesFeedback(top);
    }
  }, [futuresStore.history]);

  function handleSubmitFuturesOrder(params: {
    side: FuturesSide;
    orderType: "market" | "limit";
    limitPrice: number | null;
    leverage: number;
    marginMode: "isolated" | "cross";
    margin: number;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) {
    if (params.orderType === "market" && currentPrice !== null) {
      futuresStore.openMarketPosition({
        pair,
        side: params.side,
        leverage: params.leverage,
        marginMode: params.marginMode,
        margin: params.margin,
        quantity: params.quantity,
        price: currentPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
      });
    } else if (params.orderType === "limit" && params.limitPrice !== null) {
      futuresStore.placeLimitOrder({
        pair,
        side: params.side,
        leverage: params.leverage,
        marginMode: params.marginMode,
        quantity: params.quantity,
        limitPrice: params.limitPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
      });
    }
  }

  function handleCloseFuturesPosition(id: string) {
    if (currentPrice === null) return;
    futuresStore.closePosition(id, currentPrice, "manual", buildFuturesFeedback);
  }

  const futuresExtraPriceLines: ExtraPriceLine[] = useMemo(() => {
    if (!futuresPositionForPair) return [];
    const lines: ExtraPriceLine[] = [
      { price: futuresPositionForPair.entryPrice, color: "#3ba8ff", title: `ENTRADA ${futuresPositionForPair.side === "long" ? "▲" : "▼"}` },
      { price: futuresPositionForPair.liquidationPrice, color: "#ef4444", title: "LIQ", style: 2 },
    ];
    if (futuresPositionForPair.stopLoss !== null) lines.push({ price: futuresPositionForPair.stopLoss, color: "#ef4444", title: "SL", style: 2 });
    if (futuresPositionForPair.takeProfit !== null) lines.push({ price: futuresPositionForPair.takeProfit, color: "#22c55e", title: "TP", style: 2 });
    return lines;
  }, [futuresPositionForPair]);

  const activeBalance = market === "spot" ? store.balance : futuresStore.balance;
  const activeDayPnl = market === "spot" ? dayPnl : futuresDayPnl;

  return (
    <div>
      <SectionHeader
        title="Terminal"
        subtitle="Paper trading profesional con datos reales de Binance en vivo — cuenta simulada, cero riesgo real."
      />

      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => setMode("live")}
          className={`px-4 py-2 rounded-lg text-sm font-mono border ${
            mode === "live" ? "border-neon-green/50 text-neon-green bg-neon-green/5" : "border-void-border text-slate-500"
          }`}
        >
          ● Terminal en vivo
        </button>
        <button
          onClick={() => setMode("replay")}
          className={`px-4 py-2 rounded-lg text-sm font-mono border ${
            mode === "replay" ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
          }`}
        >
          ⏱ Modo Replay
        </button>
      </div>

      {mode === "replay" ? (
        <ReplayTerminal />
      ) : (
        <>
          <PairBar
        pair={pair}
        onPairChange={(p) => setPair(p as BinancePair)}
        ticker={streams.ticker}
        connected={streams.connected}
        balance={activeBalance}
        dayPnl={activeDayPnl}
        lastTickUp={streams.ticker ? streams.ticker.priceChangePercent >= 0 : null}
          />

      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => setMarket("spot")}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono border ${
            market === "spot" ? "border-neon-green/50 text-neon-green bg-neon-green/5" : "border-void-border text-slate-500"
          }`}
        >
          SPOT
        </button>
        <button
          onClick={() => setMarket("futures")}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono border ${
            market === "futures" ? "border-neon-red/50 text-neon-red bg-neon-red/5" : "border-void-border text-slate-500"
          }`}
        >
          FUTUROS
        </button>
        {market === "futures" && (
          <span className="text-[11px] text-slate-500 self-center ml-1">
            Alto riesgo — leé la pestaña{" "}
            <Link to="/app/contratos" className="text-neon-blue underline">
              Contratos
            </Link>{" "}
            y el{" "}
            <Link to="/riesgo" target="_blank" className="text-neon-blue underline">
              Aviso de Riesgo
            </Link>{" "}
            antes de operar.
          </span>
        )}
      </div>

      {market === "spot" && lastFeedback && (
        <div className={`panel border p-4 mb-4 ${lastFeedback.pnl >= 0 ? "border-neon-green/40 bg-neon-green/5" : "border-neon-red/40 bg-neon-red/5"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono font-bold tracking-widest">
              TRADE CERRADO — {lastFeedback.pnl >= 0 ? "+" : ""}
              {lastFeedback.pnl.toFixed(2)} USD
            </div>
            <button onClick={() => setLastFeedback(null)} className="text-slate-500 text-xs">
              ✕
            </button>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
            {lastFeedback.feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {market === "futures" && lastFuturesFeedback && (
        <div
          className={`panel border p-4 mb-4 ${
            lastFuturesFeedback.exitReason === "liquidation"
              ? "border-neon-red/60 bg-neon-red/10"
              : lastFuturesFeedback.pnl >= 0
                ? "border-neon-green/40 bg-neon-green/5"
                : "border-neon-red/40 bg-neon-red/5"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono font-bold tracking-widest">
              {lastFuturesFeedback.exitReason === "liquidation" ? "POSICIÓN LIQUIDADA — " : "TRADE CERRADO — "}
              {lastFuturesFeedback.pnl >= 0 ? "+" : ""}
              {lastFuturesFeedback.pnl.toFixed(2)} USD
            </div>
            <button onClick={() => setLastFuturesFeedback(null)} className="text-slate-500 text-xs">
              ✕
            </button>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
            {lastFuturesFeedback.feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex gap-1.5">
              {TERMINAL_INTERVALS.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setIntervalValue(tf)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
                    interval === tf ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <IndicatorTogglesPanel />
          </div>

          <div className="panel p-3">
            {historyQuery.isLoading ? (
              <div className="text-center text-slate-500 text-sm py-20">Cargando velas de Binance…</div>
            ) : historyQuery.isError ? (
              <div className="text-center text-neon-red text-sm py-20">
                No se pudo conectar con Binance. Puede ser un bloqueo temporal o de tu red — probá de nuevo en unos segundos.
              </div>
            ) : (
              <TerminalChart
                candles={candles}
                liveKline={streams.kline}
                toggles={toggles}
                indicators={indicators}
                position={market === "spot" ? positionForPair : null}
                pendingOrders={market === "spot" ? ordersForPair : []}
                extraPriceLines={market === "futures" ? futuresExtraPriceLines : []}
              />
            )}
          </div>

          <TerminalOscillators candles={candles} toggles={toggles} indicators={indicators} />
        </div>

        <div className="space-y-4">
          {market === "spot" ? (
            <OrderPanel
              pair={pair}
              currentPrice={currentPrice}
              balance={store.balance}
              hasOpenPosition={positionForPair !== null}
              onSubmit={handleSubmitOrder}
            />
          ) : (
            <FuturesOrderPanel
              pair={pair}
              currentPrice={currentPrice}
              balance={futuresStore.balance}
              hasOpenPosition={futuresPositionForPair !== null}
              onSubmit={handleSubmitFuturesOrder}
            />
          )}
          <OrderBookPanel orderBook={streams.orderBook} />
          <TradesFeed trades={streams.trades} />
        </div>
      </div>

      {market === "spot" ? (
        <ManagementTabs
          positions={store.positions}
          orders={store.orders}
          history={store.history}
          balance={store.balance}
          currentPrices={currentPrices}
          onClosePosition={handleClosePosition}
          onCancelOrder={store.cancelOrder}
          onUpdateSlTp={store.updatePositionSlTp}
        />
      ) : (
        <FuturesManagementTabs
          positions={futuresStore.positions}
          orders={futuresStore.orders}
          history={futuresStore.history}
          balance={futuresStore.balance}
          currentPrices={currentPrices}
          onClosePosition={handleCloseFuturesPosition}
          onCancelOrder={futuresStore.cancelOrder}
          onUpdateSlTp={futuresStore.updatePositionSlTp}
        />
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            if (market === "spot") {
              if (confirm("¿Reiniciar la cuenta simulada de Spot? Se borra todo el historial y volvés a $10,000.")) {
                store.resetAccount();
              }
            } else if (confirm("¿Reiniciar la cuenta simulada de Futuros? Se borra todo el historial y volvés a $10,000.")) {
              futuresStore.resetAccount();
            }
          }}
          className="text-xs font-mono text-slate-500 hover:text-neon-red border border-void-border hover:border-neon-red/40 rounded-lg px-3 py-1.5"
        >
          Reiniciar cuenta {market === "spot" ? "Spot" : "Futuros"}
        </button>
      </div>
        </>
      )}

      <Disclaimer text="Simulación educativa con dinero ficticio. Los precios son reales (Binance en vivo), pero ninguna operación acá tiene efecto financiero real. Esto es contexto educativo, no asesoría financiera (NFA)." />
    </div>
  );
}
