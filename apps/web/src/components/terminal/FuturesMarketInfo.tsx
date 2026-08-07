import { formatCompactUsd, formatCompactNumber } from "../../lib/format";

interface Props {
  pair: string;
  currentPrice: number | null;
  fundingRate: number | undefined;
  openInterest: number | null | undefined;
}

/** Surfaces two futures-specific numbers that existed in the codebase already (funding rate was
 * only used internally to charge paper-trading positions) or are newly added (open interest) but
 * were never actually shown to the user — both are core to understanding what a perpetual
 * contract is, and Contratos already teaches funding rate without a live number to look at. */
export function FuturesMarketInfo({ pair, currentPrice, fundingRate, openInterest }: Props) {
  const fundingPercent = fundingRate !== undefined ? fundingRate * 100 : null;
  const openInterestUsd = openInterest !== null && openInterest !== undefined && currentPrice !== null ? openInterest * currentPrice : null;

  return (
    <div className="panel p-3 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
      <div>
        <div className="text-[10px] font-mono text-slate-500">FUNDING RATE ({pair.replace("USDT", "")})</div>
        <div className={`value-mono font-semibold ${fundingPercent === null ? "text-slate-500" : fundingPercent >= 0 ? "text-neon-gold" : "text-neon-green"}`}>
          {fundingPercent !== null ? `${fundingPercent >= 0 ? "+" : ""}${fundingPercent.toFixed(4)}%` : "—"}
          <span className="text-slate-600 font-normal"> / 8h</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] font-mono text-slate-500">OPEN INTEREST</div>
        <div className="value-mono text-slate-200 font-semibold">
          {openInterest !== null && openInterest !== undefined ? formatCompactNumber(openInterest) : "—"}
          {openInterestUsd !== null && <span className="text-slate-500 font-normal"> ({formatCompactUsd(openInterestUsd)})</span>}
        </div>
      </div>
      <p className="text-[10px] text-slate-600 max-w-xs">
        Funding {fundingPercent !== null && fundingPercent >= 0 ? "positivo: los longs le pagan a los shorts" : "negativo: los shorts le pagan a los longs"} cada 8h. Open Interest = valor total de contratos aún abiertos en Binance — sube cuando entra dinero nuevo, baja cuando se cierran posiciones.
      </p>
    </div>
  );
}
