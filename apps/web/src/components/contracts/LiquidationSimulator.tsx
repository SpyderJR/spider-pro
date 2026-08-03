import { useMemo, useState } from "react";
import { useMarketCoins, useKlines } from "../../hooks/useMarketData";
import { computeLiquidationPrice, liquidationDistancePercent, type FuturesSide } from "../../lib/futures/liquidation";
import { formatUsd, pricePrecision } from "../../lib/format";

const FALLBACK_ENTRY_PRICE = 63000;
const FALLBACK_NOISE_PERCENT = 3;

export function LiquidationSimulator() {
  const coins = useMarketCoins();
  const klines = useKlines("BTC", "1d", 30);
  const [leverage, setLeverage] = useState(10);
  const [side, setSide] = useState<FuturesSide>("long");

  const entryPrice = coins.data?.coins.find((c) => c.symbol === "BTC")?.price ?? FALLBACK_ENTRY_PRICE;

  const avgDailyRangePercent = useMemo(() => {
    const candles = klines.data?.candles ?? [];
    if (candles.length === 0) return FALLBACK_NOISE_PERCENT;
    const sum = candles.reduce((s, c) => s + ((c.high - c.low) / c.close) * 100, 0);
    return sum / candles.length;
  }, [klines.data]);

  const distancePercent = liquidationDistancePercent(leverage);
  const liqPrice = computeLiquidationPrice(entryPrice, leverage, side);
  const inNoiseBand = distancePercent <= avgDailyRangePercent;
  const precision = pricePrecision(entryPrice);

  // Visualization scale: whichever is bigger between the liquidation distance and the
  // noise band, plus headroom, so both are always visible.
  const scaleMaxPercent = Math.max(distancePercent, avgDailyRangePercent) * 1.3;
  const bandTop = 50 - (avgDailyRangePercent / scaleMaxPercent) * 50;
  const bandHeight = (avgDailyRangePercent / scaleMaxPercent) * 100;
  const liqY = side === "long" ? 50 + (distancePercent / scaleMaxPercent) * 50 : 50 - (distancePercent / scaleMaxPercent) * 50;

  return (
    <div className="panel p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-1">Simulador de liquidación</h2>
      <p className="text-sm text-slate-400 mb-5">
        Moné el apalancamiento y mirá qué tan cerca queda tu precio de liquidación del precio de entrada — y compará esa
        distancia con el movimiento normal de un día de BTC.
      </p>

      <div className="grid md:grid-cols-[1fr_260px] gap-6">
        <div>
          <svg viewBox="0 0 300 220" className="w-full h-56" role="img" aria-label="Distancia a liquidación vs ruido diario">
            {/* noise band */}
            <rect x={20} y={bandTop / 100 * 220} width={260} height={(bandHeight / 100) * 220} fill="#94a3b8" opacity={0.18} />
            <text x={285} y={(bandTop / 100) * 220 + 4} textAnchor="end" fontSize={8} fontFamily="monospace" fill="#94a3b8">
              ruido 24h
            </text>
            {/* entry line */}
            <line x1={20} y1={110} x2={280} y2={110} stroke="#3ba8ff" strokeWidth={2} />
            <text x={25} y={104} fontSize={9} fontFamily="monospace" fill="#3ba8ff">
              ENTRADA {formatUsd(entryPrice, precision <= 2 ? 2 : precision)}
            </text>
            {/* liquidation line */}
            <line
              x1={20}
              y1={(liqY / 100) * 220}
              x2={280}
              y2={(liqY / 100) * 220}
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeDasharray={inNoiseBand ? "0" : "5 3"}
            />
            <text x={25} y={(liqY / 100) * 220 + (side === "long" ? 14 : -6)} fontSize={9} fontFamily="monospace" fill="#ef4444" fontWeight="bold">
              LIQ {formatUsd(liqPrice, precision <= 2 ? 2 : precision)}
            </text>
          </svg>

          <div className={`mt-2 text-center text-sm font-bold ${inNoiseBand ? "text-neon-red" : "text-neon-green"}`}>
            Distancia a liquidación: {distancePercent.toFixed(2)}%
          </div>

          {inNoiseBand && (
            <div className="mt-3 bg-neon-red/10 border border-neon-red/30 rounded-lg p-3 text-sm text-neon-red text-center">
              A este apalancamiento, el movimiento normal de un día te liquida aunque tengas razón en la dirección.
            </div>
          )}
        </div>

        <div>
          <div className="flex gap-1.5 mb-4">
            <button
              onClick={() => setSide("long")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border ${side === "long" ? "border-neon-green/60 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500"}`}
            >
              LONG
            </button>
            <button
              onClick={() => setSide("short")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border ${side === "short" ? "border-neon-red/60 text-neon-red bg-neon-red/10" : "border-void-border text-slate-500"}`}
            >
              SHORT
            </button>
          </div>

          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono text-slate-500">APALANCAMIENTO</label>
            <span className="value-mono text-lg font-bold text-white">{leverage}x</span>
          </div>
          <input
            type="range"
            min={1}
            max={125}
            step={1}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full accent-neon-red mb-4"
          />

          <div className="bg-void-soft rounded-lg p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Ruido típico diario BTC</span>
              <span className="value-mono text-slate-300">±{avgDailyRangePercent.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Precio de entrada</span>
              <span className="value-mono text-slate-300">{formatUsd(entryPrice, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Precio de liquidación</span>
              <span className="value-mono text-neon-red">{formatUsd(liqPrice, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
