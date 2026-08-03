import { useMemo } from "react";
import { useReplayStore } from "../../../store/replayStore";
import { useTerminalPreferencesStore } from "../../../store/terminalPreferencesStore";
import { useTerminalIndicators } from "../../../hooks/useTerminalIndicators";
import { TerminalChart } from "../TerminalChart";
import { TerminalOscillators } from "../TerminalOscillators";
import { IndicatorTogglesPanel } from "../IndicatorTogglesPanel";
import { OrderPanel } from "../OrderPanel";
import { ManagementTabs } from "../ManagementTabs";
import { ReplaySetup } from "./ReplaySetup";
import { ReplayControls } from "./ReplayControls";
import { ReplaySummaryPanel } from "./ReplaySummaryPanel";

export function ReplayTerminal() {
  const status = useReplayStore((s) => s.status);

  if (status === "setup") return <ReplaySetup />;
  if (status === "finished") return <ReplaySummaryPanel />;
  return <ActiveReplay />;
}

function ActiveReplay() {
  const { candles, currentIndex, symbol, balance, positions, orders, history, openMarketPosition, placeLimitOrder, cancelOrder, updatePositionSlTp, closePositionManually } =
    useReplayStore();
  const { toggles } = useTerminalPreferencesStore();

  const visibleCandles = useMemo(() => candles.slice(0, currentIndex + 1), [candles, currentIndex]);
  const indicators = useTerminalIndicators(visibleCandles, toggles, null);
  const currentPrice = visibleCandles.at(-1)?.close ?? null;
  const currentPrices = useMemo(() => ({ [symbol]: currentPrice ?? undefined }), [symbol, currentPrice]);
  const position = positions.find((p) => p.pair === symbol) ?? null;

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
              {symbol} · {useReplayStore.getState().interval}
            </span>
            <IndicatorTogglesPanel />
          </div>

          <div className="panel p-3">
            <TerminalChart candles={visibleCandles} liveKline={null} toggles={toggles} indicators={indicators} position={position} pendingOrders={orders} />
          </div>

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
