import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { Disclaimer } from "../components/Disclaimer";
import { useFearGreed, useMarketCoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent, formatUsd } from "../lib/format";
import { computeMarketZone } from "../lib/signalEngine";

const ZONE_STYLES = {
  compra: { label: "ZONA DE COMPRA", cls: "text-neon-green border-neon-green/40 bg-neon-green/5" },
  neutral: { label: "ZONA NEUTRAL", cls: "text-neon-gold border-neon-gold/40 bg-neon-gold/5" },
  venta: { label: "ZONA DE VENTA", cls: "text-neon-red border-neon-red/40 bg-neon-red/5" },
};

export function SpiderIntelligencePage() {
  const fearGreed = useFearGreed();
  const coins = useMarketCoins();

  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");
  const trx = coins.data?.coins.find((c) => c.symbol === "TRX");

  const avgAthChange =
    btc && trx ? (btc.athChangePercent + trx.athChangePercent) / 2 : null;

  const reading =
    fearGreed.data && avgAthChange !== null
      ? computeMarketZone(fearGreed.data.value, avgAthChange)
      : null;

  usePublishContext("spider-intelligence", {
    fearGreedValue: fearGreed.data?.value ?? null,
    fearGreedClassification: fearGreed.data?.classification ?? null,
    btcPrice: btc?.price ?? null,
    trxPrice: trx?.price ?? null,
    zone: reading?.zone ?? null,
  });

  return (
    <div>
      <SectionHeader
        title="Spider Intelligence"
        subtitle="Lectura combinada del sentimiento de mercado y la distancia al máximo histórico de BTC y TRX."
      />

      {reading && (
        <div className={`panel border p-5 mb-6 ${ZONE_STYLES[reading.zone].cls}`}>
          <div className="text-xs font-mono font-bold tracking-widest mb-2">
            {ZONE_STYLES[reading.zone].label}
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">{reading.message}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Fear & Greed"
          value={fearGreed.data ? fearGreed.data.value : "—"}
          sub={fearGreed.data?.classification.replace("_", " ")}
          accent="gold"
        />
        <StatCard
          label="BTC precio"
          value={btc ? formatUsd(btc.price) : "—"}
          sub={btc ? formatPercent(btc.change24h ?? 0) + " (24h)" : undefined}
          accent={btc && (btc.change24h ?? 0) >= 0 ? "green" : "red"}
        />
        <StatCard
          label="TRX precio"
          value={trx ? formatUsd(trx.price, 5) : "—"}
          sub={trx ? formatPercent(trx.change24h ?? 0) + " (24h)" : undefined}
          accent={trx && (trx.change24h ?? 0) >= 0 ? "green" : "red"}
        />
        <StatCard
          label="Distancia media al ATH"
          value={avgAthChange !== null ? formatPercent(avgAthChange, false) : "—"}
          accent="blue"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Bitcoin", coin: btc },
          { label: "TRON", coin: trx },
        ].map(({ label, coin }) => (
          <div key={label} className="panel p-5">
            <div className="font-semibold text-white mb-3">{label} — cambio por marco temporal</div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {(
                [
                  ["1h", coin?.change1h],
                  ["24h", coin?.change24h],
                  ["7d", coin?.change7d],
                  ["30d", coin?.change30d],
                  ["1a", coin?.change1y],
                ] as const
              ).map(([tf, val]) => (
                <div key={tf} className="bg-void-soft rounded-lg py-2">
                  <div className="text-[10px] text-slate-500 mb-1">{tf}</div>
                  <div
                    className={`value-mono text-xs font-semibold ${
                      val === null || val === undefined
                        ? "text-slate-600"
                        : val >= 0
                          ? "text-neon-green"
                          : "text-neon-red"
                    }`}
                  >
                    {val === null || val === undefined ? "—" : formatPercent(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="panel p-5">
        <div className="font-semibold text-white mb-3">Guía estática de señales de compra/venta</div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <div className="text-neon-green font-mono text-xs mb-2">SEÑALES DE POSIBLE COMPRA</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Fear & Greed en miedo extremo (&lt;25)</li>
              <li>Precio lejos del ATH (&gt;35% de distancia)</li>
              <li>RSI en zona de sobreventa (&lt;30)</li>
              <li>Golden Cross reciente en temporalidades altas</li>
            </ul>
          </div>
          <div>
            <div className="text-neon-red font-mono text-xs mb-2">SEÑALES DE POSIBLE VENTA / CAUTELA</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Fear & Greed en codicia extrema (&gt;75)</li>
              <li>Precio muy cerca del ATH (&lt;12% de distancia)</li>
              <li>RSI en zona de sobrecompra (&gt;70)</li>
              <li>Death Cross reciente en temporalidades altas</li>
            </ul>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
