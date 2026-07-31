import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { Disclaimer } from "../components/Disclaimer";
import { PriceLineChart } from "../components/charts/PriceLineChart";
import { useMarketCoins, useMarketHistory } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatCompactUsd, formatPercent, formatUsd } from "../lib/format";
import { BTC_FACT_SHEET } from "../data/assetFactSheets";

export function BitcoinPage() {
  const coins = useMarketCoins();
  const history = useMarketHistory("BTC", 30);
  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");

  const change24h = btc?.change24h ?? 0;
  const interpretation =
    change24h >= 3
      ? "Movimiento alcista fuerte en las últimas 24h — momentum comprador claro en el corto plazo."
      : change24h <= -3
        ? "Movimiento bajista fuerte en las últimas 24h — presión vendedora clara en el corto plazo."
        : "Movimiento lateral en las últimas 24h — sin dirección dominante en el corto plazo.";

  usePublishContext("bitcoin", {
    price: btc?.price ?? null,
    ath: btc?.ath ?? null,
    marketCap: btc?.marketCap ?? null,
    change24h: btc?.change24h ?? null,
    athChangePercent: btc?.athChangePercent ?? null,
  });

  return (
    <div>
      <SectionHeader title="Bitcoin" subtitle="Precio en vivo, contexto de mercado y ficha técnica del activo." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Precio" value={btc ? formatUsd(btc.price) : "—"} accent="green" />
        <StatCard
          label="Cambio 24h"
          value={btc ? formatPercent(btc.change24h ?? 0) : "—"}
          accent={change24h >= 0 ? "green" : "red"}
        />
        <StatCard label="Market Cap" value={btc ? formatCompactUsd(btc.marketCap) : "—"} accent="blue" />
        <StatCard
          label="ATH"
          value={btc ? formatUsd(btc.ath) : "—"}
          sub={btc ? `${formatPercent(btc.athChangePercent, false)} desde ATH` : undefined}
          accent="gold"
        />
      </div>

      <div className="panel p-5 mb-6">
        <div className="text-xs font-mono text-slate-500 mb-2">INTERPRETACIÓN AUTOMÁTICA</div>
        <p className="text-slate-200 text-sm">{interpretation}</p>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-3">Precio — últimos 30 días</div>
        {history.data && <PriceLineChart points={history.data.points} color="#f7931a" />}
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Ficha técnica</div>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {Object.entries({
            Nombre: BTC_FACT_SHEET.name,
            Ticker: BTC_FACT_SHEET.ticker,
            Lanzamiento: BTC_FACT_SHEET.launched,
            Creador: BTC_FACT_SHEET.creator,
            "Suministro máximo": BTC_FACT_SHEET.maxSupply,
            Consenso: BTC_FACT_SHEET.consensus,
            "Tiempo de bloque": BTC_FACT_SHEET.blockTime,
            "Caso de uso": BTC_FACT_SHEET.useCase,
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
