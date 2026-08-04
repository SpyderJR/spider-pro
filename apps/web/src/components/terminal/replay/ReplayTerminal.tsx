import { useEffect, useMemo, useState } from "react";
import { useReplayStore } from "../../../store/replayStore";
import { useTerminalPreferencesStore } from "../../../store/terminalPreferencesStore";
import { useTerminalIndicators } from "../../../hooks/useTerminalIndicators";
import { useSyncedCharts, type SyncedChartHandle } from "../../../hooks/useSyncedCharts";
import { TerminalChart } from "../TerminalChart";
import { TerminalOscillators } from "../TerminalOscillators";
import { IndicatorTogglesPanel } from "../IndicatorTogglesPanel";
import { OrderPanel } from "../OrderPanel";
import { ManagementTabs } from "../ManagementTabs";
import { ReplaySetup } from "./ReplaySetup";
import { ReplayControls } from "./ReplayControls";
import { ReplaySummaryPanel } from "./ReplaySummaryPanel";
import { SecondaryReplayChart } from "./SecondaryReplayChart";
import { fetchCachedCandles } from "../../../lib/arcade/historicalCandles";
import { BINANCE_PAIRS, type BinancePair } from "../../../lib/binance/types";
import type { BinanceCandle } from "../../../lib/binance/types";

export function ReplayTerminal() {
  const status = useReplayStore((s) => s.status);

  if (status === "setup") return <ReplaySetup />;
  if (status === "finished") return <ReplaySummaryPanel />;
  return <ActiveReplay />;
}

function ActiveReplay() {
  const { candles, currentIndex, symbol, interval, balance, positions, orders, history, openMarketPosition, placeLimitOrder, cancelOrder, updatePositionSlTp, closePositionManually } =
    useReplayStore();
  const { toggles } = useTerminalPreferencesStore();

  const visibleCandles = useMemo(() => candles.slice(0, currentIndex + 1), [candles, currentIndex]);
  const indicators = useTerminalIndicators(visibleCandles, toggles, null);
  const currentPrice = visibleCandles.at(-1)?.close ?? null;
  const currentPrices = useMemo(() => ({ [symbol]: currentPrice ?? undefined }), [symbol, currentPrice]);
  const position = positions.find((p) => p.pair === symbol) ?? null;

  const otherSymbol = (BINANCE_PAIRS.find((p) => p !== symbol) ?? symbol) as BinancePair;
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [secondaryCandles, setSecondaryCandles] = useState<BinanceCandle[]>([]);
  const [primaryHandle, setPrimaryHandle] = useState<SyncedChartHandle | null>(null);
  const [secondaryHandle, setSecondaryHandle] = useState<SyncedChartHandle | null>(null);

  useEffect(() => {
    if (!compareEnabled || candles.length === 0) return;
    let cancelled = false;
    const startTime = candles[0]!.time * 1000;
    const endTime = candles[candles.length - 1]!.time * 1000 + 24 * 60 * 60 * 1000;
    fetchCachedCandles(otherSymbol, interval, startTime, endTime).then((result) => {
      if (!cancelled) setSecondaryCandles(result);
    });
    return () => {
      cancelled = true;
    };
  }, [compareEnabled, candles, interval, otherSymbol]);

  const visibleSecondaryCandles = useMemo(() => {
    if (secondaryCandles.length === 0) return [];
    return secondaryCandles.slice(0, Math.min(secondaryCandles.length, currentIndex + 1));
  }, [secondaryCandles, currentIndex]);

  // Chart/series refs stay stable once created — only the candle snapshot needs refreshing
  // each tick, so the sync hook's crosshair time→price lookup always has the latest bars.
  useEffect(() => {
    setPrimaryHandle((h) => (h ? { ...h, candles: visibleCandles } : h));
  }, [visibleCandles]);
  useEffect(() => {
    setSecondaryHandle((h) => (h ? { ...h, candles: visibleSecondaryCandles } : h));
  }, [visibleSecondaryCandles]);

  useSyncedCharts(compareEnabled ? primaryHandle : null, compareEnabled ? secondaryHandle : null);

  function handleSubmitOrder(params: {
    side: "buy" | "sell";
    orderType: "market" | "limit";
    limitPrice: number | null;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) {
    if (params.orderType === "market" && currentPrice !== null) {
      openMarketPosition({
        side: params.side,
        usdAmount: params.quantity * currentPrice,
        quantity: params.quantity,
        price: currentPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
      });
    } else if (params.orderType === "limit" && params.limitPrice !== null) {
      placeLimitOrder({
        side: params.side,
        quantity: params.quantity,
        limitPrice: params.limitPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
      });
    }
  }

  return (
    <div>
      <ReplayControls />

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono text-slate-500">
              {symbol} · {interval}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareEnabled((v) => !v)}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  compareEnabled ? "border-neon-blue/50 text-neon-blue bg-neon-blue/10" : "border-void-border text-slate-500 hover:border-slate-600"
                }`}
              >
                ⇄ Comparar con {otherSymbol}
              </button>
              <IndicatorTogglesPanel />
            </div>
          </div>

          <div className="panel p-3">
            <TerminalChart
              candles={visibleCandles}
              liveKline={null}
              toggles={toggles}
              indicators={indicators}
              position={position}
              pendingOrders={orders}
              onChartReady={(chart, series) => setPrimaryHandle({ chart, series, candles: visibleCandles })}
            />
          </div>

          {compareEnabled && (
            visibleSecondaryCandles.length > 0 ? (
              <div className="mt-3">
                <SecondaryReplayChart
                  candles={visibleSecondaryCandles}
                  label={`${otherSymbol} · sincronizado con ${symbol}`}
                  height={220}
                  onChartReady={(chart, series) => setSecondaryHandle({ chart, series, candles: visibleSecondaryCandles })}
                />
              </div>
            ) : (
              <div className="panel p-4 mt-3 text-xs text-slate-500 text-center">Cargando {otherSymbol}…</div>
            )
          )}

          <TerminalOscillators candles={visibleCandles} toggles={toggles} indicators={indicators} />
        </div>

        <div className="space-y-4">
          <OrderPanel
            pair={symbol}
            currentPrice={currentPrice}
            balance={balance}
            hasOpenPosition={position !== null}
            onSubmit={handleSubmitOrder}
          />
        </div>
      </div>

      <ManagementTabs
        positions={positions}
        orders={orders}
        history={history}
        balance={balance}
        currentPrices={currentPrices}
        onClosePosition={closePositionManually}
        onCancelOrder={cancelOrder}
        onUpdateSlTp={updatePositionSlTp}
      />
    </div>
  );
}
