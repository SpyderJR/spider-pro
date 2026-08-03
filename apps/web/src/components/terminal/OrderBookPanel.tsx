import type { OrderBookSnapshot } from "../../lib/binance/types";
import { pricePrecision } from "../../lib/format";

export function OrderBookPanel({ orderBook }: { orderBook: OrderBookSnapshot | null }) {
  if (!orderBook) {
    return <div className="panel p-4 text-xs text-slate-500 text-center">Cargando order book…</div>;
  }

  const asks = orderBook.asks.slice(0, 12).reverse();
  const bids = orderBook.bids.slice(0, 12);
  const maxQty = Math.max(...asks.map((a) => a.qty), ...bids.map((b) => b.qty), 1);
  const precision = asks[0] ? pricePrecision(asks[0].price) : 2;

  return (
    <div className="panel p-3">
      <div className="text-[10px] font-mono text-slate-500 mb-2">ORDER BOOK</div>
      <div className="text-[10px] value-mono">
        {asks.map((a, i) => (
          <div key={`ask-${i}`} className="relative flex justify-between py-0.5 px-1">
            <div className="absolute inset-y-0 right-0 bg-neon-red/10" style={{ width: `${(a.qty / maxQty) * 100}%` }} />
            <span className="relative text-neon-red">{a.price.toFixed(precision)}</span>
            <span className="relative text-slate-400">{a.qty.toFixed(4)}</span>
          </div>
        ))}
      </div>
      <div className="border-y border-void-border my-1.5" />
      <div className="text-[10px] value-mono">
        {bids.map((b, i) => (
          <div key={`bid-${i}`} className="relative flex justify-between py-0.5 px-1">
            <div className="absolute inset-y-0 right-0 bg-neon-green/10" style={{ width: `${(b.qty / maxQty) * 100}%` }} />
            <span className="relative text-neon-green">{b.price.toFixed(precision)}</span>
            <span className="relative text-slate-400">{b.qty.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
