import type { RecentTrade } from "../../lib/binance/types";
import { pricePrecision } from "../../lib/format";

export function TradesFeed({ trades }: { trades: RecentTrade[] }) {
  return (
    <div className="panel p-3">
      <div className="text-[10px] font-mono text-slate-500 mb-2">ÚLTIMOS TRADES</div>
      <div className="text-[10px] value-mono max-h-[220px] overflow-y-auto">
        {trades.length === 0 && <div className="text-slate-600 py-4 text-center">Esperando trades…</div>}
        {trades.map((t) => {
          const isSell = t.isBuyerMaker; // buyer is maker => aggressor was a seller
          const precision = pricePrecision(t.price);
          return (
            <div key={t.id} className="flex justify-between py-0.5 px-1">
              <span className={isSell ? "text-neon-red" : "text-neon-green"}>{t.price.toFixed(precision)}</span>
              <span className="text-slate-400">{t.qty.toFixed(4)}</span>
              <span className="text-slate-600">{new Date(t.time).toLocaleTimeString("es-ES")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
