import { useMarketCoins } from "../../hooks/useMarketData";
import { estimateLeverageZones, DEFAULT_LEVERAGE_TIERS } from "../../lib/futures/leverageZones";
import { formatUsd, pricePrecision } from "../../lib/format";

const FALLBACK_ENTRY_PRICE = 63000;

export function LeverageZonesPanel() {
  const coins = useMarketCoins();
  const currentPrice = coins.data?.coins.find((c) => c.symbol === "BTC")?.price ?? FALLBACK_ENTRY_PRICE;
  const precision = pricePrecision(currentPrice);

  const zones = estimateLeverageZones(currentPrice, DEFAULT_LEVERAGE_TIERS);
  const longZones = zones.filter((z) => z.side === "long");
  const shortZones = zones.filter((z) => z.side === "short");

  return (
    <div className="panel p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-white">Zonas de apalancamiento estimadas</h2>
        <span className="text-[9px] font-mono font-bold tracking-widest text-neon-gold border border-neon-gold/40 bg-neon-gold/10 rounded px-1.5 py-0.5">
          ESTIMACIÓN / MODELO
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-5 leading-relaxed">
        Estas zonas se calculan con la misma fórmula de precio de liquidación que usa la Terminal y el Simulador de
        Contratos, aplicada a apalancamientos comunes sobre el precio actual de BTC ({formatUsd(currentPrice, 0)}) —
        <strong className="text-slate-300"> no es un mapa de liquidaciones reales de otros traders</strong>, porque
        esa información no existe públicamente gratis en ninguna API. Es una guía educativa de dónde{" "}
        <em>tendrían</em> que liquidarse posiciones abiertas a esos apalancamientos si el precio se moviera desde
        aquí.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-mono text-neon-green tracking-widest mb-2">LONG — liquida si el precio cae</div>
          <div className="space-y-1.5">
            {longZones.map((z) => (
              <div key={`long-${z.leverage}`} className="flex items-center justify-between bg-void-soft rounded-lg px-3 py-2 text-xs">
                <span className="value-mono font-bold text-white">{z.leverage}x</span>
                <span className="value-mono text-slate-300">{formatUsd(z.estimatedLiquidationPrice, precision <= 2 ? 2 : precision)}</span>
                <span className="value-mono text-neon-red">-{z.distancePercent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-neon-red tracking-widest mb-2">SHORT — liquida si el precio sube</div>
          <div className="space-y-1.5">
            {shortZones.map((z) => (
              <div key={`short-${z.leverage}`} className="flex items-center justify-between bg-void-soft rounded-lg px-3 py-2 text-xs">
                <span className="value-mono font-bold text-white">{z.leverage}x</span>
                <span className="value-mono text-slate-300">{formatUsd(z.estimatedLiquidationPrice, precision <= 2 ? 2 : precision)}</span>
                <span className="value-mono text-neon-red">+{z.distancePercent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
