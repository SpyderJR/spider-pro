import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { LiveBadge } from "../components/LiveBadge";
import { StatCard } from "../components/StatCard";
import { useStablecoins, useTronStats } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatCompactUsd, formatCompactNumber, formatPercent } from "../lib/format";
import { USDT_QUARTERLY_GROWTH } from "../data/stablecoinHistory";
import { STABLECOIN_INFO } from "../data/stablecoinInfo";

const BAR_COLORS: Record<string, string> = {
  USDT: "#39ff9c",
  USDC: "#3ba8ff",
  USDD: "#ffcf4d",
  TUSD: "#ff3b5c",
  USDJ: "#a78bfa",
};

export function StablecoinsPage() {
  const stablecoins = useStablecoins();
  const tronStats = useTronStats();
  const usdt = stablecoins.data?.stablecoins.find((s) => s.symbol === "USDT");

  usePublishContext("stablecoins", {
    totalSupply: stablecoins.data?.totalSupply ?? null,
    stablecoins: stablecoins.data?.stablecoins ?? null,
    live: stablecoins.data?.live ?? null,
    source: stablecoins.data?.source ?? null,
  });

  const maxGrowth = Math.max(...USDT_QUARTERLY_GROWTH.map((q) => q.usdtSupplyBillions));

  const totalSupply = stablecoins.data?.totalSupply ?? 0;
  const ranked = stablecoins.data
    ? [...stablecoins.data.stablecoins].sort((a, b) => b.supply - a.supply)
    : [];

  return (
    <div>
      <SectionHeader
        title="Stablecoins TRON"
        subtitle="Supply, holders y participación de mercado en vivo de las principales stablecoins emitidas sobre la red TRON."
        right={stablecoins.data && <LiveBadge live={stablecoins.data.live} source={stablecoins.data.source} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
        <StatCard
          label="Participación de USDT"
          value={usdt && totalSupply > 0 ? formatPercent((usdt.supply / totalSupply) * 100, false) : "—"}
          accent="green"
        />
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-1">Ranking de stablecoins en TRON</div>
        <p className="text-xs text-slate-500 mb-4">Ordenadas por supply — datos en vivo de TronScan.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-void-border">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Stablecoin</th>
                <th className="py-2 pr-4">Supply</th>
                <th className="py-2 pr-4">Holders</th>
                <th className="py-2 pr-4">% del total</th>
                <th className="py-2">Promedio por holder</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr key={s.symbol} className="border-b border-void-border/50 last:border-0">
                  <td className="py-2.5 pr-4 text-slate-500 value-mono">{i + 1}</td>
                  <td className="py-2.5 pr-4 text-white font-semibold">{s.symbol}</td>
                  <td className="py-2.5 pr-4 value-mono text-neon-green">{formatCompactUsd(s.supply)}</td>
                  <td className="py-2.5 pr-4 value-mono text-slate-300">
                    {s.holders ? formatCompactNumber(s.holders) : "—"}
                  </td>
                  <td className="py-2.5 pr-4 value-mono text-slate-300">
                    {totalSupply > 0 ? formatPercent((s.supply / totalSupply) * 100, false) : "—"}
                  </td>
                  <td className="py-2.5 value-mono text-slate-500">
                    {s.holders ? formatCompactUsd(s.supply / s.holders) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Participación de mercado</div>
        <div className="space-y-3">
          {ranked.map((s) => {
            const pct = totalSupply > 0 ? (s.supply / totalSupply) * 100 : 0;
            return (
              <div key={s.symbol}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-mono">{s.symbol}</span>
                  <span className="value-mono text-slate-400">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-void-soft overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: BAR_COLORS[s.symbol] ?? "#39ff9c" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Crecimiento histórico de USDT por trimestre</div>
        <div className="flex items-stretch gap-3 h-40">
          {USDT_QUARTERLY_GROWTH.map((q) => (
            <div key={q.quarter} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[10px] value-mono text-slate-400">${q.usdtSupplyBillions}B</div>
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full bg-neon-green/20 border-t-2 border-neon-green rounded-t"
                  style={{ height: `${(q.usdtSupplyBillions / maxGrowth) * 100}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-600">{q.quarter}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="font-semibold text-white mb-3">Qué respalda a cada stablecoin — y su riesgo real</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ranked.map((s) => {
            const info = STABLECOIN_INFO[s.symbol];
            return (
              <div key={s.symbol} className="panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-bold">{info.symbol}</span>
                  <span className="text-xs text-slate-500">{info.name}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mb-1">EMISOR</div>
                <p className="text-xs text-slate-400 mb-2">{info.issuer}</p>
                <div className="text-[10px] font-mono text-slate-500 mb-1">RESPALDO</div>
                <p className="text-xs text-slate-400 mb-2">{info.backing}</p>
                <div className="text-[10px] font-mono text-neon-red mb-1">RIESGO A TENER EN CUENTA</div>
                <p className="text-xs text-slate-400">{info.risk}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-2">Por qué importa el supply de stablecoins para TRX</div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          La gran mayoría de las transferencias de USDT a nivel global ocurren sobre la red TRON, gracias a
          sus comisiones bajas y su alta velocidad de confirmación. Cada transacción de stablecoins consume
          TRX como combustible de red (directa o indirectamente vía "energía" delegada), por lo que un mayor
          supply y actividad de stablecoins se traduce en mayor demanda estructural de la red TRON.
        </p>
        {tronStats.data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-void-soft rounded-lg p-3">
              <div className="text-[10px] text-slate-500 mb-1 uppercase">Cuentas activas en TRON</div>
              <div className="value-mono text-sm text-neon-blue font-semibold">
                {formatCompactNumber(tronStats.data.totalAccounts ?? 0)}
              </div>
            </div>
            <div className="bg-void-soft rounded-lg p-3">
              <div className="text-[10px] text-slate-500 mb-1 uppercase">Transacciones totales</div>
              <div className="value-mono text-sm text-neon-blue font-semibold">
                {formatCompactNumber(tronStats.data.totalTransactions ?? 0)}
              </div>
            </div>
            <div className="bg-void-soft rounded-lg p-3">
              <div className="text-[10px] text-slate-500 mb-1 uppercase">TPS actual</div>
              <div className="value-mono text-sm text-neon-blue font-semibold">
                {tronStats.data.tps?.toFixed(0) ?? "—"}
              </div>
            </div>
          </div>
        )}
      </div>

      <Disclaimer text="Los datos de supply y holders son en vivo de TronScan. El respaldo declarado de cada stablecoin proviene de la información pública de cada emisor — Spider Pro no audita ni garantiza esas reservas. Contenido educativo, no asesoría financiera (NFA)." />
    </div>
  );
}
