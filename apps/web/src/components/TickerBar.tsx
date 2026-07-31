import { useMarketCoins } from "../hooks/useMarketData";
import { formatPercent, formatUsd } from "../lib/format";

export function TickerBar() {
  const coins = useMarketCoins();
  const btc = coins.data?.coins.find((c) => c.symbol === "BTC");
  const trx = coins.data?.coins.find((c) => c.symbol === "TRX");

  return (
    <div className="border-b border-void-border bg-void-soft/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-6 overflow-x-auto text-xs">
        <TickerItem label="BTC/USD" price={btc?.price} change={btc?.change24h} decimals={2} />
        <div className="w-px h-4 bg-void-border shrink-0" />
        <TickerItem label="TRX/USD" price={trx?.price} change={trx?.change24h} decimals={5} />
        <div className="ml-auto flex items-center gap-1.5 shrink-0 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono">MERCADO EN VIVO</span>
        </div>
      </div>
    </div>
  );
}

function TickerItem({
  label,
  price,
  change,
  decimals,
}: {
  label: string;
  price: number | undefined;
  change: number | null | undefined;
  decimals: number;
}) {
  const isUp = (change ?? 0) >= 0;
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="font-mono text-slate-500">{label}</span>
      <span className="value-mono text-slate-100 font-semibold">
        {price !== undefined ? formatUsd(price, decimals) : "—"}
      </span>
      {change !== undefined && change !== null && (
        <span className={`value-mono font-medium ${isUp ? "text-neon-green" : "text-neon-red"}`}>
          {isUp ? "▲" : "▼"} {formatPercent(change)}
        </span>
      )}
    </div>
  );
}
