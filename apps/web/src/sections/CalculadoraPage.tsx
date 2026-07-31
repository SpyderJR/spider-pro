import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { useMarketCoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatUsd } from "../lib/format";

type ConvertUnit = "BTC" | "TRX" | "USD";

export function CalculadoraPage() {
  const coins = useMarketCoins();
  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");
  const trx = coins.data?.coins.find((c) => c.symbol === "TRX");

  const [convertAmount, setConvertAmount] = useState(1);
  const [convertFrom, setConvertFrom] = useState<ConvertUnit>("USD");

  const [scenarioAsset, setScenarioAsset] = useState<"BTC" | "TRX">("BTC");
  const [scenarioAmount, setScenarioAmount] = useState(1000);
  const [scenarioTargetPrice, setScenarioTargetPrice] = useState(0);

  usePublishContext("calculadora", {
    btcPrice: btc?.price ?? null,
    trxPrice: trx?.price ?? null,
  });

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

  const scenarioCoin = scenarioAsset === "BTC" ? btc : trx;
  const currentValue = scenarioCoin ? scenarioAmount * scenarioCoin.price : null;
  const targetValue =
    scenarioTargetPrice > 0 ? scenarioAmount * scenarioTargetPrice : null;
  const scenarioChangePercent =
    currentValue && targetValue ? ((targetValue - currentValue) / currentValue) * 100 : null;

  return (
    <div>
      <SectionHeader title="Calculadora" subtitle="Escenarios de precio, conversor instantáneo y proyecciones de valor." />

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

      <div className="panel p-5">
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
          <div>
            <label className="text-xs text-slate-500 block mb-1">Cantidad que tenés</label>
            <input
              type="number"
              value={scenarioAmount}
              onChange={(e) => setScenarioAmount(Number(e.target.value))}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Precio objetivo (USD)</label>
            <input
              type="number"
              value={scenarioTargetPrice || ""}
              onChange={(e) => setScenarioTargetPrice(Number(e.target.value))}
              placeholder={scenarioCoin ? scenarioCoin.price.toFixed(2) : "0"}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[11px] text-slate-500 mb-1">Valor actual</div>
            <div className="value-mono text-sm text-slate-200">
              {currentValue !== null ? formatUsd(currentValue) : "—"}
            </div>
          </div>
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[11px] text-slate-500 mb-1">Valor proyectado</div>
            <div className="value-mono text-sm text-neon-gold">
              {targetValue !== null ? formatUsd(targetValue) : "—"}
            </div>
          </div>
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[11px] text-slate-500 mb-1">Cambio</div>
            <div
              className={`value-mono text-sm ${
                scenarioChangePercent === null
                  ? "text-slate-600"
                  : scenarioChangePercent >= 0
                    ? "text-neon-green"
                    : "text-neon-red"
              }`}
            >
              {scenarioChangePercent !== null ? `${scenarioChangePercent >= 0 ? "+" : ""}${scenarioChangePercent.toFixed(1)}%` : "—"}
            </div>
          </div>
        </div>
      </div>

      <Disclaimer text="Los escenarios de precio son ejercicios matemáticos hipotéticos, no proyecciones ni promesas de rendimiento (NFA)." />
    </div>
  );
}
