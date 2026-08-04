import { useState } from "react";
import type { OrderBookSnapshot } from "../../lib/binance/types";
import { pricePrecision } from "../../lib/format";
import { DepthHeatmap } from "./DepthHeatmap";

interface Props {
  orderBook: OrderBookSnapshot | null;
  /** Wider REST+WS merged snapshot (~1000 levels) used only by the "Mapa" view. */
  depthSnapshot: OrderBookSnapshot | null;
}

export function OrderBookPanel({ orderBook, depthSnapshot }: Props) {
  const [mode, setMode] = useState<"lista" | "mapa">("lista");

  if (!orderBook) {
    return <div className="panel p-4 text-xs text-slate-500 text-center">Cargando order book…</div>;
  }

  const asks = orderBook.asks.slice(0, 12).reverse();
  const bids = orderBook.bids.slice(0, 12);
  const maxQty = Math.max(...asks.map((a) => a.qty), ...bids.map((b) => b.qty), 1);
  const precision = asks[0] ? pricePrecision(asks[0].price) : 2;

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-mono text-slate-500">ORDER BOOK</div>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("lista")}
            className={`px-2 py-0.5 rounded text-[9px] font-mono border ${mode === "lista" ? "border-neon-green/50 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500"}`}
          >
            LISTA
          </button>
          <button
            onClick={() => setMode("mapa")}
            className={`px-2 py-0.5 rounded text-[9px] font-mono border ${mode === "mapa" ? "border-neon-green/50 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500"}`}
          >
            MAPA DE PROFUNDIDAD
          </button>
        </div>
      </div>

      {mode === "lista" ? (
        <>
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
        </>
      ) : (
        <>
          <DepthHeatmap orderBook={depthSnapshot} />
          <p className="text-[9px] text-slate-600 mt-2 leading-relaxed">
            Profundidad real del order book de Binance (±3% del precio medio) — tamaño acumulado por nivel de precio, actualizado cada ~5s.
          </p>
        </>
      )}
    </div>
  );
}
