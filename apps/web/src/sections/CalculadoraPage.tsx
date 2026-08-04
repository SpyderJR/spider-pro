import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { useMarketCoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatUsd } from "../lib/format";
import { computePositionSize, breakevenWinRate, drawdownRecoveryPercent } from "../lib/riskMath";
import { computeRiskRewardRatio, computePnl, computePnlPercent } from "../lib/paperTrading/engine";
import { computeLiquidationPrice, computeRequiredMargin, liquidationDistancePercent, type FuturesSide } from "../lib/futures/liquidation";
import type { OrderSide } from "../lib/paperTrading/types";

type ConvertUnit = "BTC" | "TRX" | "USD";

const TOOLS = [
  { id: "convertidor", label: "Convertidor" },
  { id: "escenario", label: "Escenario de precio" },
  { id: "posicion", label: "Tamaño de posición" },
  { id: "riesgo-beneficio", label: "Riesgo/Beneficio" },
  { id: "liquidacion", label: "Liquidación" },
  { id: "pnl", label: "P&L de un trade" },
  { id: "promedio", label: "Precio promedio (DCA)" },
  { id: "recuperacion", label: "Recuperación de drawdown" },
] as const;
type ToolId = (typeof TOOLS)[number]["id"];

function NumberField({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
      />
    </div>
  );
}

function ResultBox({ label, value, accent = "neutral" }: { label: string; value: string; accent?: "green" | "red" | "gold" | "neutral" }) {
  const color = accent === "green" ? "text-neon-green" : accent === "red" ? "text-neon-red" : accent === "gold" ? "text-neon-gold" : "text-slate-200";
  return (
    <div className="bg-void-soft rounded-lg p-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className={`value-mono text-sm ${color}`}>{value}</div>
    </div>
  );
}

function SideToggle<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; color: "green" | "red" }[] }) {
  return (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 rounded-lg text-sm font-bold border ${
            value === opt.value
              ? opt.color === "green"
                ? "border-neon-green/60 text-neon-green bg-neon-green/10"
                : "border-neon-red/60 text-neon-red bg-neon-red/10"
              : "border-void-border text-slate-500"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function CalculadoraPage() {
  const coins = useMarketCoins();
  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");
  const trx = coins.data?.coins.find((c) => c.symbol === "TRX");
  const [tool, setTool] = useState<ToolId>("convertidor");

  usePublishContext("calculadora", { btcPrice: btc?.price ?? null, trxPrice: trx?.price ?? null, tool });

  // --- Convertidor ---
  const [convertAmount, setConvertAmount] = useState(1);
  const [convertFrom, setConvertFrom] = useState<ConvertUnit>("USD");
  const usdValue = useMemo(() => {
    if (!btc || !trx) return null;
    if (convertFrom === "USD") return convertAmount;
    if (convertFrom === "BTC") return convertAmount * btc.price;
    return convertAmount * trx.price;
  }, [convertAmount, convertFrom, btc, trx]);
  const conversions = useMemo(() => {
    if (usdValue === null || !btc || !trx) return null;
    return { usd: usdValue, btc: usdValue / btc.price, trx: usdValue / trx.price };
  }, [usdValue, btc, trx]);

  // --- Escenario de precio ---
  const [scenarioAsset, setScenarioAsset] = useState<"BTC" | "TRX">("BTC");
  const [scenarioAmount, setScenarioAmount] = useState(1000);
  const [scenarioTargetPrice, setScenarioTargetPrice] = useState(0);
  const scenarioCoin = scenarioAsset === "BTC" ? btc : trx;
  const currentValue = scenarioCoin ? scenarioAmount * scenarioCoin.price : null;
  const targetValue = scenarioTargetPrice > 0 ? scenarioAmount * scenarioTargetPrice : null;
  const scenarioChangePercent = currentValue && targetValue ? ((targetValue - currentValue) / currentValue) * 100 : null;

  // --- Tamaño de posición ---
  const [posBalance, setPosBalance] = useState(10_000);
  const [posRiskPercent, setPosRiskPercent] = useState(1);
  const [posEntry, setPosEntry] = useState(63_000);
  const [posSl, setPosSl] = useState(61_740);
  const posResult = computePositionSize(posBalance, posRiskPercent, posEntry, posSl);

  // --- Riesgo/Beneficio ---
  const [rrSide, setRrSide] = useState<OrderSide>("buy");
  const [rrEntry, setRrEntry] = useState(63_000);
  const [rrSl, setRrSl] = useState(61_740);
  const [rrTp, setRrTp] = useState(65_520);
  const rrRatio = computeRiskRewardRatio(rrEntry, rrSl, rrTp, rrSide);
  const rrBreakeven = rrRatio !== null ? breakevenWinRate(rrRatio) : null;

  // --- Liquidación ---
  const [liqSide, setLiqSide] = useState<FuturesSide>("long");
  const [liqEntry, setLiqEntry] = useState(63_000);
  const [liqLeverage, setLiqLeverage] = useState(10);
  const [liqNotional, setLiqNotional] = useState(1_000);
  const liqPrice = computeLiquidationPrice(liqEntry, liqLeverage, liqSide);
  const liqDistance = liquidationDistancePercent(liqLeverage);
  const liqMargin = computeRequiredMargin(liqNotional, liqLeverage);

  // --- P&L de un trade ---
  const [pnlSide, setPnlSide] = useState<OrderSide>("buy");
  const [pnlEntry, setPnlEntry] = useState(63_000);
  const [pnlExit, setPnlExit] = useState(65_000);
  const [pnlQuantity, setPnlQuantity] = useState(0.05);
  const pnlAmount = computePnl(pnlSide, pnlEntry, pnlExit, pnlQuantity);
  const pnlPercent = computePnlPercent(pnlSide, pnlEntry, pnlExit);

  // --- Precio promedio (DCA) ---
  const [dcaBuys, setDcaBuys] = useState([{ price: 65_000, amount: 500 }, { price: 58_000, amount: 500 }]);
  const dcaResult = useMemo(() => {
    const totalUsd = dcaBuys.reduce((sum, b) => sum + b.amount, 0);
    const totalQty = dcaBuys.reduce((sum, b) => sum + (b.price > 0 ? b.amount / b.price : 0), 0);
    if (totalQty === 0) return null;
    return { avgPrice: totalUsd / totalQty, totalUsd, totalQty };
  }, [dcaBuys]);

  // --- Recuperación de drawdown ---
  const [ddLossPercent, setDdLossPercent] = useState(20);
  const ddRecovery = drawdownRecoveryPercent(ddLossPercent);

  return (
    <div>
      <SectionHeader title="Calculadora" subtitle="8 herramientas de cálculo para trading — conversión, riesgo, posición, liquidación y más. Todo por fórmulas fijas, sin IA." />

      <div className="flex flex-wrap gap-1.5 mb-6">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              tool === t.id ? "border-neon-green/50 text-neon-green bg-neon-green/5" : "border-void-border text-slate-400 hover:border-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tool === "convertidor" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-4">Conversor instantáneo BTC / TRX / USD</div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(Number(e.target.value))}
              className="bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono w-36"
            />
            <select
              value={convertFrom}
              onChange={(e) => setConvertFrom(e.target.value as ConvertUnit)}
              className="bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200"
            >
              <option value="USD">USD</option>
              <option value="BTC">BTC</option>
              <option value="TRX">TRX</option>
            </select>
          </div>
          {conversions && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-void-soft rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-500 mb-1">USD</div>
                <div className="value-mono text-sm text-neon-green">{formatUsd(conversions.usd)}</div>
              </div>
              <div className="bg-void-soft rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-500 mb-1">BTC</div>
                <div className="value-mono text-sm text-neon-gold">{conversions.btc.toFixed(8)}</div>
              </div>
              <div className="bg-void-soft rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-500 mb-1">TRX</div>
                <div className="value-mono text-sm text-neon-blue">{conversions.trx.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {tool === "escenario" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-4">Calculadora de escenarios de precio</div>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Activo</label>
              <select
                value={scenarioAsset}
                onChange={(e) => setScenarioAsset(e.target.value as "BTC" | "TRX")}
                className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200"
              >
                <option value="BTC">BTC</option>
                <option value="TRX">TRX</option>
              </select>
            </div>
            <NumberField label="Cantidad que tienes" value={scenarioAmount} onChange={setScenarioAmount} />
            <NumberField label="Precio objetivo (USD)" value={scenarioTargetPrice} onChange={setScenarioTargetPrice} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultBox label="Valor actual" value={currentValue !== null ? formatUsd(currentValue) : "—"} />
            <ResultBox label="Valor proyectado" value={targetValue !== null ? formatUsd(targetValue) : "—"} accent="gold" />
            <ResultBox
              label="Cambio"
              value={scenarioChangePercent !== null ? `${scenarioChangePercent >= 0 ? "+" : ""}${scenarioChangePercent.toFixed(1)}%` : "—"}
              accent={scenarioChangePercent === null ? "neutral" : scenarioChangePercent >= 0 ? "green" : "red"}
            />
          </div>
        </div>
      )}

      {tool === "posicion" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-1">Tamaño de posición por riesgo</div>
          <p className="text-xs text-slate-500 mb-4">Primero decides cuánto arriesgas, el tamaño sale de ahí — nunca al revés.</p>
          <div className="grid sm:grid-cols-4 gap-3 mb-4">
            <NumberField label="Balance de tu cuenta" value={posBalance} onChange={setPosBalance} />
            <NumberField label="Riesgo (%)" value={posRiskPercent} onChange={setPosRiskPercent} step={0.1} />
            <NumberField label="Precio de entrada" value={posEntry} onChange={setPosEntry} />
            <NumberField label="Stop loss" value={posSl} onChange={setPosSl} />
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            <ResultBox label="Distancia al SL" value={posResult ? `${posResult.distancePercent.toFixed(2)}%` : "—"} />
            <ResultBox label="Monto que arriesgas" value={posResult ? formatUsd(posResult.riskAmount) : "—"} accent="red" />
            <ResultBox label="Tamaño de posición" value={posResult ? formatUsd(posResult.positionSizeUsd) : "—"} accent="green" />
            <ResultBox label="Cantidad" value={posResult ? posResult.quantity.toFixed(6) : "—"} accent="gold" />
          </div>
        </div>
      )}

      {tool === "riesgo-beneficio" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-4">Ratio Riesgo/Beneficio</div>
          <div className="mb-4">
            <SideToggle
              value={rrSide}
              onChange={setRrSide}
              options={[
                { value: "buy", label: "LONG", color: "green" },
                { value: "sell", label: "SHORT", color: "red" },
              ]}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <NumberField label="Entrada" value={rrEntry} onChange={setRrEntry} />
            <NumberField label="Stop loss" value={rrSl} onChange={setRrSl} />
            <NumberField label="Take profit" value={rrTp} onChange={setRrTp} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <ResultBox label="Ratio R:R" value={rrRatio !== null ? `1:${rrRatio.toFixed(2)}` : "Datos inválidos"} accent="green" />
            <ResultBox label="Win rate mínimo para empatar" value={rrBreakeven !== null ? `${rrBreakeven.toFixed(1)}%` : "—"} accent="gold" />
          </div>
        </div>
      )}

      {tool === "liquidacion" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-4">Precio de liquidación (futuros)</div>
          <div className="mb-4">
            <SideToggle
              value={liqSide}
              onChange={setLiqSide}
              options={[
                { value: "long", label: "LONG", color: "green" },
                { value: "short", label: "SHORT", color: "red" },
              ]}
            />
          </div>
          <div className="grid sm:grid-cols-4 gap-3 mb-4">
            <NumberField label="Precio de entrada" value={liqEntry} onChange={setLiqEntry} />
            <NumberField label="Apalancamiento (x)" value={liqLeverage} onChange={setLiqLeverage} />
            <NumberField label="Exposición total (USD)" value={liqNotional} onChange={setLiqNotional} />
            <div />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultBox label="Precio de liquidación (aprox.)" value={formatUsd(liqPrice, 2)} accent="red" />
            <ResultBox label="Distancia a liquidación" value={`${liqDistance.toFixed(2)}%`} accent="gold" />
            <ResultBox label="Margen requerido" value={formatUsd(liqMargin)} accent="green" />
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Aproximado con margen de mantenimiento ~0.5% — varía por exchange. Ver Contratos para el detalle completo.</p>
        </div>
      )}

      {tool === "pnl" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-4">Ganancia/Pérdida de un trade cerrado</div>
          <div className="mb-4">
            <SideToggle
              value={pnlSide}
              onChange={setPnlSide}
              options={[
                { value: "buy", label: "COMPRA", color: "green" },
                { value: "sell", label: "VENTA", color: "red" },
              ]}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <NumberField label="Precio de entrada" value={pnlEntry} onChange={setPnlEntry} />
            <NumberField label="Precio de salida" value={pnlExit} onChange={setPnlExit} />
            <NumberField label="Cantidad" value={pnlQuantity} onChange={setPnlQuantity} step={0.001} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <ResultBox label="Ganancia/Pérdida" value={`${pnlAmount >= 0 ? "+" : ""}${formatUsd(pnlAmount)}`} accent={pnlAmount >= 0 ? "green" : "red"} />
            <ResultBox label="Ganancia/Pérdida %" value={`${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}%`} accent={pnlPercent >= 0 ? "green" : "red"} />
          </div>
        </div>
      )}

      {tool === "promedio" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-1">Precio promedio de compra (DCA)</div>
          <p className="text-xs text-slate-500 mb-4">Agrega cada compra que hiciste para calcular tu costo promedio real.</p>
          <div className="space-y-2 mb-3">
            {dcaBuys.map((buy, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="number"
                  value={buy.price}
                  onChange={(e) => setDcaBuys((prev) => prev.map((b, j) => (j === i ? { ...b, price: Number(e.target.value) } : b)))}
                  placeholder="Precio"
                  className="flex-1 bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100"
                />
                <input
                  type="number"
                  value={buy.amount}
                  onChange={(e) => setDcaBuys((prev) => prev.map((b, j) => (j === i ? { ...b, amount: Number(e.target.value) } : b)))}
                  placeholder="Monto USD"
                  className="flex-1 bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100"
                />
                <button
                  onClick={() => setDcaBuys((prev) => prev.filter((_, j) => j !== i))}
                  disabled={dcaBuys.length <= 1}
                  className="text-neon-red text-xs font-mono px-2 py-1 hover:bg-neon-red/10 rounded disabled:opacity-30"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setDcaBuys((prev) => [...prev, { price: 0, amount: 0 }])}
            className="text-[10px] font-mono text-neon-blue px-2 py-1 border border-neon-blue/40 rounded hover:bg-neon-blue/10 mb-4"
          >
            + AGREGAR COMPRA
          </button>
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultBox label="Precio promedio" value={dcaResult ? formatUsd(dcaResult.avgPrice, 4) : "—"} accent="gold" />
            <ResultBox label="Invertido total" value={dcaResult ? formatUsd(dcaResult.totalUsd) : "—"} />
            <ResultBox label="Cantidad total" value={dcaResult ? dcaResult.totalQty.toFixed(6) : "—"} accent="green" />
          </div>
        </div>
      )}

      {tool === "recuperacion" && (
        <div className="panel p-5 mb-6">
          <div className="font-semibold text-white mb-1">Recuperación de drawdown</div>
          <p className="text-xs text-slate-500 mb-4">Perder crece más rápido de lo que parece — recuperarse crece más rápido todavía.</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <NumberField label="% que perdiste" value={ddLossPercent} onChange={setDdLossPercent} step={1} />
            <ResultBox
              label="% que necesitas ganar para recuperarte"
              value={Number.isFinite(ddRecovery) ? `+${ddRecovery.toFixed(1)}%` : "Cuenta en cero"}
              accent="red"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-void-border">
                  <th className="py-1.5 pr-3">Pérdida</th>
                  <th className="py-1.5">Ganancia necesaria para recuperar</th>
                </tr>
              </thead>
              <tbody>
                {[10, 20, 30, 50, 75, 90].map((loss) => (
                  <tr key={loss} className="border-b border-void-border/50 last:border-0">
                    <td className="py-1.5 pr-3 value-mono text-neon-red">-{loss}%</td>
                    <td className="py-1.5 value-mono text-neon-green">+{drawdownRecoveryPercent(loss).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Disclaimer text="Todos los resultados son ejercicios matemáticos con fórmulas fijas, no proyecciones ni promesas de rendimiento. Contenido educativo, no asesoría financiera (NFA)." />
    </div>
  );
}
