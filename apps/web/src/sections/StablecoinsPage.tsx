import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { StatCard } from "../components/StatCard";
import { useStablecoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatCompactUsd, formatCompactNumber } from "../lib/format";
import { USDT_QUARTERLY_GROWTH } from "../data/stablecoinHistory";

export function StablecoinsPage() {
  const stablecoins = useStablecoins();
  const usdt = stablecoins.data?.stablecoins.find((s) => s.symbol === "USDT");

  usePublishContext("stablecoins", {
    totalSupply: stablecoins.data?.totalSupply ?? null,
    stablecoins: stablecoins.data?.stablecoins ?? null,
    live: stablecoins.data?.live ?? null,
    source: stablecoins.data?.source ?? null,
  });

  const maxGrowth = Math.max(...USDT_QUARTERLY_GROWTH.map((q) => q.usdtSupplyBillions));

  return (
    <div>
      <SectionHeader
        title="Stablecoins TRON"
        subtitle="Supply en vivo de las principales stablecoins en la red TRON."
        right={stablecoins.data && <LiveBadge live={stablecoins.data.live} source={stablecoins.data.source} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Supply total (5 stablecoins)"
          value={stablecoins.data ? formatCompactUsd(stablecoins.data.totalSupply) : "—"}
          accent="green"
        />
        <StatCard
          label="Holders de USDT"
          value={usdt?.holders ? formatCompactNumber(usdt.holders) : "—"}
          accent="blue"
        />
        <StatCard
          label="Supply de USDT"
          value={usdt ? formatCompactUsd(usdt.supply) : "—"}
          accent="gold"
        />
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Supply por stablecoin</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stablecoins.data?.stablecoins.map((s) => (
            <div key={s.symbol} className="bg-void-soft rounded-lg p-3 text-center">
              <div className="text-xs font-mono text-slate-400 mb-1">{s.symbol}</div>
              <div className="value-mono text-sm text-neon-green font-semibold">
                {formatCompactUsd(s.supply)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Crecimiento histórico de USDT por trimestre</div>
        <div className="flex items-end gap-3 h-40">
          {USDT_QUARTERLY_GROWTH.map((q) => (
            <div key={q.quarter} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[10px] value-mono text-slate-400">${q.usdtSupplyBillions}B</div>
              <div
                className="w-full bg-neon-green/20 border-t-2 border-neon-green rounded-t"
                style={{ height: `${(q.usdtSupplyBillions / maxGrowth) * 100}%` }}
              />
              <div className="text-[9px] text-slate-600">{q.quarter}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5">
        <div className="font-semibold text-white mb-2">¿Por qué importa el supply de stablecoins para TRX?</div>
        <p className="text-sm text-slate-400">
          La gran mayoría de las transferencias de USDT a nivel global ocurren sobre la red TRON, gracias a
          sus comisiones bajas y su alta velocidad de confirmación. Cada transacción de stablecoins consume
          TRX como combustible de red (directa o indirectamente vía "energía" delegada), por lo que un mayor
          supply y actividad de stablecoins se traduce en mayor demanda estructural de la red TRON.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
