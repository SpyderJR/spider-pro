import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { PriceLineChart } from "../components/charts/PriceLineChart";
import { useMarketCoins, useMarketHistory, useBitcoinStats } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatCompactUsd, formatCompactNumber, formatPercent, formatUsd } from "../lib/format";
import { BTC_FACT_SHEET } from "../data/assetFactSheets";

export function BitcoinPage() {
  const coins = useMarketCoins();
  const history = useMarketHistory("BTC", 30);
  const btcStats = useBitcoinStats();
  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");

  const change24h = btc?.change24h ?? 0;
  const interpretation =
    change24h >= 3
      ? "Movimiento alcista fuerte en las últimas 24h — momentum comprador claro en el corto plazo."
      : change24h <= -3
        ? "Movimiento bajista fuerte en las últimas 24h — presión vendedora clara en el corto plazo."
        : "Movimiento lateral en las últimas 24h — sin dirección dominante en el corto plazo.";

  const s = btcStats.data;
  const retargetDate = s ? new Date(s.difficultyAdjustment.estimatedRetargetDate) : null;
  const mempoolCongested = s ? s.mempool.count > 20_000 : false;

  usePublishContext("bitcoin", {
    price: btc?.price ?? null,
    ath: btc?.ath ?? null,
    marketCap: btc?.marketCap ?? null,
    change24h: btc?.change24h ?? null,
    athChangePercent: btc?.athChangePercent ?? null,
    onChain: s ?? null,
  });

  return (
    <div>
      <SectionHeader
        title="Bitcoin"
        subtitle="Precio en vivo, datos on-chain reales de la red y ficha técnica del activo."
        right={s && <LiveBadge live={btcStats.data?.live ?? false} source="mempool.space" />}
      />

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
        <div className="font-semibold text-white mb-4">Red Bitcoin — datos on-chain en vivo (mempool.space)</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[10px] text-slate-500 mb-1 uppercase">Altura de bloque</div>
            <div className="value-mono text-sm text-neon-blue font-semibold">
              {s ? formatCompactNumber(s.blockHeight) : "—"}
            </div>
          </div>
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[10px] text-slate-500 mb-1 uppercase">Hashrate de red</div>
            <div className="value-mono text-sm text-neon-green font-semibold">
              {s ? `${s.hashrateEhs.toFixed(0)} EH/s` : "—"}
            </div>
          </div>
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[10px] text-slate-500 mb-1 uppercase">Dificultad</div>
            <div className="value-mono text-sm text-neon-gold font-semibold">
              {s ? formatCompactNumber(s.difficulty) : "—"}
            </div>
          </div>
          <div className="bg-void-soft rounded-lg p-3">
            <div className="text-[10px] text-slate-500 mb-1 uppercase">Mempool (tx pendientes)</div>
            <div className={`value-mono text-sm font-semibold ${mempoolCongested ? "text-neon-red" : "text-neon-green"}`}>
              {s ? formatCompactNumber(s.mempool.count) : "—"}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-void-soft rounded-lg p-4">
            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">
              FEES RECOMENDADOS (sat/vB)
            </div>
            {s ? (
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  ["Próximo bloque", s.fees.fastestFee],
                  ["~30 min", s.fees.halfHourFee],
                  ["~1 hora", s.fees.hourFee],
                  ["Económico", s.fees.economyFee],
                ].map(([label, fee]) => (
                  <div key={label as string}>
                    <div className="value-mono text-base font-bold text-white">{fee}</div>
                    <div className="text-[9px] text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">—</div>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              {s && s.fees.fastestFee <= 2
                ? "Mempool despejada — comisiones baratas en este momento."
                : s
                  ? "Congestión en la mempool — confirmar rápido cuesta más ahora."
                  : ""}
            </p>
          </div>

          <div className="bg-void-soft rounded-lg p-4">
            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">
              PRÓXIMO AJUSTE DE DIFICULTAD
            </div>
            {s ? (
              <>
                <div className="h-2 rounded-full bg-void-border overflow-hidden mb-2">
                  <div
                    className="h-full bg-neon-blue"
                    style={{ width: `${Math.min(100, s.difficultyAdjustment.progressPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{s.difficultyAdjustment.progressPercent.toFixed(1)}% del período</span>
                  <span className={s.difficultyAdjustment.difficultyChangePercent >= 0 ? "text-neon-green" : "text-neon-red"}>
                    {s.difficultyAdjustment.difficultyChangePercent >= 0 ? "+" : ""}
                    {s.difficultyAdjustment.difficultyChangePercent.toFixed(2)}% estimado
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Faltan {formatCompactNumber(s.difficultyAdjustment.remainingBlocks)} bloques · estimado{" "}
                  {retargetDate?.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500">—</div>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          El <strong className="text-slate-300">hashrate</strong> mide cuánto poder de cómputo está protegiendo la
          red — cuanto más alto, más caro (e improbable) es un ataque del 51%. La{" "}
          <strong className="text-slate-300">dificultad</strong> se ajusta automáticamente cada ~2016 bloques
          (~2 semanas) para mantener el ritmo de un bloque cada ~10 minutos pase lo que pase con el hashrate. La{" "}
          <strong className="text-slate-300">mempool</strong> es la sala de espera de transacciones sin confirmar
          — cuando se llena, las comisiones suben porque los mineros priorizan quien paga más por sat/vB.
        </p>
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
