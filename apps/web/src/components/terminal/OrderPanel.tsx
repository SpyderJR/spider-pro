import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { OrderSide } from "../../lib/paperTrading/types";
import { computeQuantity, computeRiskAmount, computeRiskRewardRatio } from "../../lib/paperTrading/engine";
import { formatUsd, pricePrecision } from "../../lib/format";

interface Props {
  pair: string;
  currentPrice: number | null;
  balance: number;
  hasOpenPosition: boolean;
  onSubmit: (params: {
    side: OrderSide;
    orderType: "market" | "limit";
    limitPrice: number | null;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
}

const PERCENT_PRESETS = [25, 50, 75, 100];

export function OrderPanel({ pair, currentPrice, balance, hasOpenPosition, onSubmit }: Props) {
  const [side, setSide] = useState<OrderSide>("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [percentOfBalance, setPercentOfBalance] = useState(25);
  const [stopLossEnabled, setStopLossEnabled] = useState(true);
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(true);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");

  const usdAmount = (balance * percentOfBalance) / 100;
  const effectivePrice = orderType === "market" ? currentPrice : Number(limitPrice) || null;
  const precision = effectivePrice ? pricePrecision(effectivePrice) : 2;
  const quantity = effectivePrice ? computeQuantity(usdAmount, effectivePrice) : 0;

  const stopLoss = stopLossEnabled && stopLossPrice ? Number(stopLossPrice) : null;
  const takeProfit = takeProfitEnabled && takeProfitPrice ? Number(takeProfitPrice) : null;

  const riskAmount = useMemo(() => {
    if (!effectivePrice || stopLoss === null) return null;
    return computeRiskAmount(effectivePrice, stopLoss, quantity, side);
  }, [effectivePrice, stopLoss, quantity, side]);

  const riskPercent = riskAmount !== null && balance > 0 ? (riskAmount / balance) * 100 : null;

  const riskReward = useMemo(() => {
    if (!effectivePrice || stopLoss === null || takeProfit === null) return null;
    return computeRiskRewardRatio(effectivePrice, stopLoss, takeProfit, side);
  }, [effectivePrice, stopLoss, takeProfit, side]);

  const canSubmit = effectivePrice !== null && quantity > 0 && !hasOpenPosition;

  function handleSubmit() {
    if (!canSubmit || !effectivePrice) return;
    onSubmit({
      side,
      orderType,
      limitPrice: orderType === "limit" ? effectivePrice : null,
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
          onClick={() => setSide("buy")}
          className={`py-2.5 rounded-lg text-sm font-bold border transition-colors ${
            side === "buy" ? "border-neon-green/60 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500"
          }`}
        >
          COMPRAR
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`py-2.5 rounded-lg text-sm font-bold border transition-colors ${
            side === "sell" ? "border-neon-red/60 text-neon-red bg-neon-red/10" : "border-void-border text-slate-500"
          }`}
        >
          VENDER
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
          <label className="text-[10px] font-mono text-slate-500">CANTIDAD</label>
          <span className="text-xs value-mono text-slate-400">{formatUsd(usdAmount, 2)}</span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
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

      {riskAmount !== null && riskPercent !== null && (
        <div className="mb-3 bg-void-soft rounded-lg p-2.5 text-xs">
          <div className={riskPercent > 3 ? "text-neon-red font-semibold" : "text-slate-300"}>
            Si toca tu SL perdés {formatUsd(riskAmount, 2)} ({riskPercent.toFixed(1)}% de tu cuenta)
          </div>
          {riskPercent > 3 && (
            <Link to="/app/gestion-de-riesgo" className="text-neon-red underline text-[10px]">
              Esto es más del 3% recomendado — ver Gestión de Riesgo
            </Link>
          )}
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
          side === "buy" ? "bg-neon-green/15 text-neon-green border border-neon-green/40" : "bg-neon-red/15 text-neon-red border border-neon-red/40"
        }`}
      >
        {side === "buy" ? "CONFIRMAR COMPRA" : "CONFIRMAR VENTA"} · {quantity > 0 ? quantity.toFixed(6) : "0"}{" "}
        {pair.replace("USDT", "")}
      </button>
    </div>
  );
}
