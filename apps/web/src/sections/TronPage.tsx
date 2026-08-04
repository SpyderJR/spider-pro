import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { PriceLineChart } from "../components/charts/PriceLineChart";
import { useMarketCoins, useMarketHistory, useTronStats } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatCompactNumber, formatCompactUsd, formatPercent, formatUsd } from "../lib/format";
import { TRX_FACT_SHEET } from "../data/assetFactSheets";

export function TronPage() {
  const coins = useMarketCoins();
  const history = useMarketHistory("TRX", 30);
  const tronStats = useTronStats();
  const trx = coins.data?.coins.find((c) => c.symbol === "TRX");
  const [holdingAmount, setHoldingAmount] = useState(10_000);

  const change24h = trx?.change24h ?? 0;
  const interpretation =
    change24h >= 3
      ? "Movimiento alcista fuerte en las últimas 24h."
      : change24h <= -3
        ? "Movimiento bajista fuerte en las últimas 24h."
        : "Movimiento lateral en las últimas 24h.";

  const priceTargets = [0.15, 0.25, 0.5, 1];

  usePublishContext("tron", {
    price: trx?.price ?? null,
    ath: trx?.ath ?? null,
    marketCap: trx?.marketCap ?? null,
    change24h: trx?.change24h ?? null,
    networkStats: tronStats.data ?? null,
  });

  const TRON_BLOCK_TIME_SECONDS = 3;
  const estimatedBlocksPerDay = Math.round(86_400 / TRON_BLOCK_TIME_SECONDS);

  const metrics = tronStats.data
    ? [
        { label: "Cuentas totales", value: formatCompactNumber(tronStats.data.totalAccounts ?? 0), meaning: "Direcciones que alguna vez tuvieron actividad en la red." },
        { label: "Transacciones totales", value: formatCompactNumber(tronStats.data.totalTransactions ?? 0), meaning: "Histórico acumulado desde el génesis de la cadena." },
        { label: "TPS actual", value: tronStats.data.tps?.toFixed(0) ?? "—", meaning: "Transacciones por segundo que está procesando la red ahora mismo." },
        { label: "Nodos", value: formatCompactNumber(tronStats.data.totalNodes ?? 0), meaning: "Nodos activos participando en el consenso y la propagación de la red." },
        { label: "Contratos (TRC20)", value: formatCompactNumber(tronStats.data.totalContracts ?? 0), meaning: "Tokens y contratos inteligentes desplegados sobre TRON." },
        { label: "Supply USDT-TRC20", value: formatCompactUsd(tronStats.data.usdtSupply ?? 0), meaning: "USDT emitido específicamente sobre la red TRON (no el total global de Tether)." },
        { label: "Altura de bloque", value: tronStats.data.blockHeight ? formatCompactNumber(tronStats.data.blockHeight) : "—", meaning: "Cantidad de bloques minados desde el génesis." },
        { label: "Bloques/día (estimado)", value: formatCompactNumber(estimatedBlocksPerDay), meaning: "Derivado del tiempo de bloque de TRON (~3 segundos), no un dato de la API." },
      ]
    : [];

  return (
    <div>
      <SectionHeader
        title="TRON"
        subtitle="Precio en vivo, métricas de red y proyecciones de valor."
        right={tronStats.data && <LiveBadge live={tronStats.data.live} source={tronStats.data.source} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Precio" value={trx ? formatUsd(trx.price, 5) : "—"} accent="green" />
        <StatCard
          label="Cambio 24h"
          value={trx ? formatPercent(trx.change24h ?? 0) : "—"}
          accent={change24h >= 0 ? "green" : "red"}
        />
        <StatCard label="Market Cap" value={trx ? formatCompactUsd(trx.marketCap) : "—"} accent="blue" />
        <StatCard
          label="ATH"
          value={trx ? formatUsd(trx.ath, 5) : "—"}
          sub={trx ? `${formatPercent(trx.athChangePercent, false)} desde ATH` : undefined}
          accent="gold"
        />
      </div>

      <div className="panel p-5 mb-6">
        <div className="text-xs font-mono text-slate-500 mb-2">INTERPRETACIÓN AUTOMÁTICA</div>
        <p className="text-slate-200 text-sm">{interpretation}</p>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-3">Precio — últimos 30 días</div>
        {history.data && <PriceLineChart points={history.data.points} color="#ff0013" />}
      </div>

      <div className="panel p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-white">Red TRON en cifras</div>
          {tronStats.data && (
            <span className="text-[10px] font-mono text-slate-500">fuente: {tronStats.data.source}</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Datos en vivo del bundle público de TronScan (el mismo que alimenta tronscan.org) — refrescado cada
          60 segundos.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-void-border">
                <th className="py-2 pr-4">Métrica</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2">Qué significa</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label} className="border-b border-void-border/50 last:border-0">
                  <td className="py-2.5 pr-4 text-slate-300 font-medium whitespace-nowrap">{m.label}</td>
                  <td className="py-2.5 pr-4 value-mono text-neon-blue font-semibold whitespace-nowrap">{m.value}</td>
                  <td className="py-2.5 text-slate-500 text-xs">{m.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Proyección de valor de tu holding</div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-400">Cantidad de TRX:</span>
          <input
            type="number"
            value={holdingAmount}
            onChange={(e) => setHoldingAmount(Number(e.target.value))}
            className="bg-void-soft border border-void-border rounded-lg px-3 py-1.5 text-sm value-mono w-32"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {priceTargets.map((target) => (
            <div key={target} className="bg-void-soft rounded-lg p-3 text-center">
              <div className="text-[11px] text-slate-500 mb-1">a {formatUsd(target, 2)}</div>
              <div className="value-mono text-sm text-neon-gold font-semibold">
                {formatUsd(holdingAmount * target)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Ficha técnica</div>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {Object.entries({
            Nombre: TRX_FACT_SHEET.name,
            Ticker: TRX_FACT_SHEET.ticker,
            Lanzamiento: TRX_FACT_SHEET.launched,
            Creador: TRX_FACT_SHEET.creator,
            "Suministro máximo": TRX_FACT_SHEET.maxSupply,
            Consenso: TRX_FACT_SHEET.consensus,
            "Tiempo de bloque": TRX_FACT_SHEET.blockTime,
            "Caso de uso": TRX_FACT_SHEET.useCase,
          }).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-void-border/60 pb-2">
              <dt className="text-slate-500">{k}</dt>
              <dd className="text-slate-200 text-right value-mono max-w-[60%]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Disclaimer />
    </div>
  );
}
