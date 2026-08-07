import { useLiquidationFeed } from "../../hooks/useLiquidationFeed";
import { formatCompactUsd } from "../../lib/format";

interface Props {
  /** Símbolo actual de la Terminal — se resalta en la lista, no filtra (perder el resto del
   * mercado le quitaría todo el valor al feed: la mayoría de las liquidaciones grandes no van a
   * ser justo del par que tienes abierto en un momento dado). */
  currentSymbol: string;
}

function timeAgo(ms: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (seconds < 60) return `hace ${seconds}s`;
  return `hace ${Math.floor(seconds / 60)}m`;
}

export function LiquidationFeedPanel({ currentSymbol }: Props) {
  const { events, connected } = useLiquidationFeed();

  return (
    <div className="panel p-4 mb-4">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Liquidaciones en vivo</h3>
          <span className="text-[9px] font-mono font-bold tracking-widest text-neon-green border border-neon-green/40 bg-neon-green/10 rounded px-1.5 py-0.5">
            DATOS REALES · BINANCE FUTURES
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-neon-green animate-pulse" : "bg-neon-red"}`} />
          {connected ? "conectado" : "reconectando…"}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
        Posiciones apalancadas de todo el mercado de futuros que Binance acaba de cerrar por
        liquidación forzosa — no es una estimación, son órdenes reales ya ejecutadas.
      </p>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {events.length === 0 ? (
          <p className="text-xs text-slate-600 text-center py-6">Esperando la próxima liquidación…</p>
        ) : (
          events.map((e) => (
            <div
              key={e.id}
              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                e.symbol === currentSymbol ? "bg-white/5 ring-1 ring-neon-blue/30" : ""
              }`}
            >
              <span className={`font-mono font-bold shrink-0 ${e.side === "long" ? "text-neon-red" : "text-neon-green"}`}>
                {e.side === "long" ? "LONG liquidado" : "SHORT liquidado"}
              </span>
              <span className="value-mono text-slate-300 shrink-0">{e.symbol.replace("USDT", "")}</span>
              <span className="value-mono text-white font-semibold shrink-0">{formatCompactUsd(e.quoteValue)}</span>
              <span className="text-slate-600 shrink-0">{timeAgo(e.time)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
