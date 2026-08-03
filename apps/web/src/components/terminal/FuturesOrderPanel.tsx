import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { MarginMode } from "../../lib/futures/types";
import type { FuturesSide } from "../../lib/futures/liquidation";
import { computeLiquidationPrice, computeRequiredMargin, liquidationDistancePercent, stopLossUnreachable } from "../../lib/futures/liquidation";
import { computeQuantity, computeRiskRewardRatio } from "../../lib/paperTrading/engine";
import { formatUsd, pricePrecision } from "../../lib/format";

interface Props {
  pair: string;
  currentPrice: number | null;
  balance: number;
  hasOpenPosition: boolean;
  onSubmit: (params: {
    side: FuturesSide;
    orderType: "market" | "limit";
    limitPrice: number | null;
    leverage: number;
    marginMode: MarginMode;
    margin: number;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
}

const PERCENT_PRESETS = [10, 25, 50, 100];

export function FuturesOrderPanel({ pair, currentPrice, balance, hasOpenPosition, onSubmit }: Props) {
  const [side, setSide] = useState<FuturesSide>("long");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [leverage, setLeverage] = useState(5);
  const [marginMode, setMarginMode] = useState<MarginMode>("isolated");
  const [percentOfBalance, setPercentOfBalance] = useState(10);
  const [stopLossEnabled, setStopLossEnabled] = useState(true);
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(true);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");

  const marginUsd = (balance * percentOfBalance) / 100;
  const notionalUsd = marginUsd * leverage;
  const effectivePrice = orderType === "market" ? currentPrice : Number(limitPrice) || null;
  const precision = effectivePrice ? pricePrecision(effectivePrice) : 2;
  const quantity = effectivePrice ? computeQuantity(notionalUsd, effectivePrice) : 0;

  const stopLoss = stopLossEnabled && stopLossPrice ? Number(stopLossPrice) : null;
  const takeProfit = takeProfitEnabled && takeProfitPrice ? Number(takeProfitPrice) : null;

  const liquidationPrice = useMemo(() => {
    if (!effectivePrice) return null;
    return computeLiquidationPrice(effectivePrice, leverage, side);
  }, [effectivePrice, leverage, side]);

  const liqDistancePercent = liquidationDistancePercent(leverage);

  const slUnreachable = stopLoss !== null && liquidationPrice !== null && stopLossUnreachable(side, stopLoss, liquidationPrice);

  const lossIfSl = useMemo(() => {
    if (!effectivePrice || stopLoss === null) return null;
    const diff = side === "long" ? effectivePrice - stopLoss : stopLoss - effectivePrice;
    return Math.max(diff, 0) * quantity;
  }, [effectivePrice, stopLoss, side, quantity]);

  const riskReward = useMemo(() => {
    if (!effectivePrice || stopLoss === null || takeProfit === null) return null;
    return computeRiskRewardRatio(effectivePrice, stopLoss, takeProfit, side === "long" ? "buy" : "sell");
  }, [effectivePrice, stopLoss, takeProfit, side]);

  const canSubmit = effectivePrice !== null && quantity > 0 && !hasOpenPosition;

  function handleSubmit() {
    if (!canSubmit || !effectivePrice) return;
    onSubmit({
      side,
      orderType,
      limitPrice: orderType === "limit" ? effectivePrice : null,
      leverage,
      marginMode,
      margin: marginUsd,
      quantity,
      stopLoss,
      takeProfit,
    });
    setLimitPrice("");
    setStopLossPrice("");
    setTakeProfitPrice("");
  }

  return (
    <div className="panel p-4">
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        <button
          onClick={() => setSide("long")}
          className={`py-2.5 rounded-lg text-sm font-bold border transition-colors ${
            side === "long" ? "border-neon-green/60 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500"
          }`}
        >
          LONG
        </button>
        <button
          onClick={() => setSide("short")}
          className={`py-2.5 rounded-lg text-sm font-bold border transition-colors ${
            side === "short" ? "border-neon-red/60 text-neon-red bg-neon-red/10" : "border-void-border text-slate-500"
          }`}
        >
          SHORT
        </button>
      </div>

      <div className="flex gap-1.5 mb-4 text-xs">
        {(["market", "limit"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`px-3 py-1 rounded-md font-mono border ${
              orderType === t ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
            }`}
          >
            {t === "market" ? "Mercado" : "Límite"}
          </button>
        ))}
      </div>

      {orderType === "limit" && (
        <div className="mb-3">
          <label className="text-[10px] font-mono text-slate-500 block mb-1">PRECIO LÍMITE ({pair})</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={currentPrice ? currentPrice.toFixed(precision) : "0.00"}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
          />
        </div>
      )}

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-mono text-slate-500">APALANCAMIENTO</label>
          <span className="value-mono text-sm font-bold text-white">{leverage}x</span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full accent-neon-red"
        />
        {leverage > 10 && (
          <p className="text-[11px] text-neon-gold mt-1">
            Apalancamiento alto — tu liquidación queda a solo {liqDistancePercent.toFixed(2)}% del precio de entrada.{" "}
            <Link to="/app/contratos" className="underline">
              Ver Contratos
            </Link>
          </p>
        )}
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-mono text-slate-500 block mb-1">MARGEN</label>
        <div className="flex gap-1.5">
          <button
            onClick={() => setMarginMode("isolated")}
            className={`flex-1 py-1.5 rounded-md text-xs font-mono border ${
              marginMode === "isolated" ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
            }`}
          >
            Aislado
          </button>
          <button
            onClick={() => setMarginMode("cross")}
            className={`flex-1 py-1.5 rounded-md text-xs font-mono border ${
              marginMode === "cross" ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
            }`}
          >
            Cruzado
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          {marginMode === "isolated"
            ? "Si te liquidan, solo perdés el margen de esta posición."
            : "Toda tu cuenta respalda esta posición — más difícil de liquidar, pero expone todo tu balance."}
        </p>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-mono text-slate-500">MARGEN A USAR</label>
          <span className="text-xs value-mono text-slate-400">{formatUsd(marginUsd, 2)}</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={percentOfBalance}
          onChange={(e) => setPercentOfBalance(Number(e.target.value))}
          className="w-full accent-neon-green"
        />
        <div className="flex gap-1.5 mt-1.5">
          {PERCENT_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setPercentOfBalance(p)}
              className={`flex-1 py-1 rounded text-[10px] font-mono border ${
                percentOfBalance === p ? "border-neon-green/50 text-neon-green" : "border-void-border text-slate-500"
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-neon-red mb-1">
            <input type="checkbox" checked={stopLossEnabled} onChange={(e) => setStopLossEnabled(e.target.checked)} />
            STOP LOSS
          </label>
          <input
            type="number"
            disabled={!stopLossEnabled}
            value={stopLossPrice}
            onChange={(e) => setStopLossPrice(e.target.value)}
            placeholder="Precio"
            className="w-full bg-void-soft border border-void-border rounded-lg px-2 py-1.5 text-xs value-mono text-slate-100 outline-none focus:border-neon-red/50 disabled:opacity-40"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-neon-green mb-1">
            <input type="checkbox" checked={takeProfitEnabled} onChange={(e) => setTakeProfitEnabled(e.target.checked)} />
            TAKE PROFIT
          </label>
          <input
            type="number"
            disabled={!takeProfitEnabled}
            value={takeProfitPrice}
            onChange={(e) => setTakeProfitPrice(e.target.value)}
            placeholder="Precio"
            className="w-full bg-void-soft border border-void-border rounded-lg px-2 py-1.5 text-xs value-mono text-slate-100 outline-none focus:border-neon-green/50 disabled:opacity-40"
          />
        </div>
      </div>

      <div className="mb-3 bg-void-soft rounded-lg p-2.5 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Margen usado</span>
          <span className="value-mono text-slate-300">{formatUsd(marginUsd, 2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Tamaño real de la posición</span>
          <span className="value-mono text-slate-300">{formatUsd(notionalUsd, 2)}</span>
        </div>
        {lossIfSl !== null && (
          <div className="flex justify-between">
            <span className="text-slate-500">Pérdida si toca tu SL</span>
            <span className="value-mono text-neon-red">-{formatUsd(lossIfSl, 2)}</span>
          </div>
        )}
        {liquidationPrice !== null && (
          <div className="flex justify-between">
            <span className="text-slate-500">Precio de liquidación</span>
            <span className="value-mono text-neon-red">
              {liquidationPrice.toFixed(precision)} ({liqDistancePercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>

      {slUnreachable && (
        <div className="mb-3 bg-neon-red/10 border border-neon-red/30 rounded-lg p-2.5 text-xs text-neon-red font-semibold">
          Tu SL está más lejos que tu liquidación: tu stop nunca se ejecutaría, te liquidás antes. Subí el SL o bajá el
          apalancamiento.
        </div>
      )}

      {riskReward !== null && (
        <div className="mb-3 text-xs text-slate-400">
          Ratio riesgo/beneficio: <span className="value-mono text-neon-blue">1:{riskReward.toFixed(1)}</span>
        </div>
      )}

      {hasOpenPosition && (
        <div className="mb-3 text-xs text-neon-gold bg-neon-gold/5 border border-neon-gold/20 rounded-lg p-2">
          Ya tenés una posición abierta en {pair}. Cerrala antes de abrir otra.
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          side === "long" ? "bg-neon-green/15 text-neon-green border border-neon-green/40" : "bg-neon-red/15 text-neon-red border border-neon-red/40"
        }`}
      >
        {side === "long" ? "CONFIRMAR LONG" : "CONFIRMAR SHORT"} · {quantity > 0 ? quantity.toFixed(6) : "0"} {pair.replace("USDT", "")}
      </button>
    </div>
  );
}
