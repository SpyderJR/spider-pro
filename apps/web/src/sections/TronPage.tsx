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

  const metrics = tronStats.data
    ? [
        ["Cuentas totales", formatCompactNumber(tronStats.data.totalAccounts ?? 0)],
        ["Transacciones totales", formatCompactNumber(tronStats.data.totalTransactions ?? 0)],
        ["TPS actual", tronStats.data.tps?.toFixed(0) ?? "—"],
        ["TVL", formatCompactUsd(tronStats.data.tvl ?? 0)],
        ["Nodos", formatCompactNumber(tronStats.data.totalNodes ?? 0)],
        ["Contratos", formatCompactNumber(tronStats.data.totalContracts ?? 0)],
        ["Supply USDT-TRC20", formatCompactUsd(tronStats.data.usdtSupply ?? 0)],
        ["Altura de bloque", tronStats.data.blockHeight ? formatCompactNumber(tronStats.data.blockHeight) : "—"],
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
        <div className="font-semibold text-white mb-4">Métricas de red en vivo</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map(([label, value]) => (
            <div key={label} className="bg-void-soft rounded-lg p-3">
              <div className="text-[10px] text-slate-500 mb-1 uppercase">{label}</div>
              <div className="value-mono text-sm text-neon-blue font-semibold">{value}</div>
            </div>
          ))}
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
