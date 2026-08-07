import { useMemo, useRef, useState } from "react";
import { useBinancePairs } from "../../hooks/useBinancePairs";
import { formatUsd, pricePrecision } from "../../lib/format";

interface Props {
  onSelect: (symbol: string) => void;
  placeholder?: string;
}

/** Search across every real, actively-trading Binance USDT pair (thousands of tokens, not just
 * BTC/TRX) — same "any token" spirit as Análisis Técnico's search, but against Binance's own
 * live spot market so the same symbol also works for streaming price, order book, and paper
 * trading in the Terminal, not just static indicator candles. */
export function PairSearchBox({ onSelect, placeholder = "Buscar cualquier par (ETH, SOL, DOGE, PEPE…)" }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: pairs, isLoading, isError } = useBinancePairs();

  const results = useMemo(() => {
    if (!pairs || query.trim().length < 1) return [];
    const q = query.trim().toUpperCase();
    return pairs.filter((p) => p.symbol.replace("USDT", "").includes(q)).slice(0, 10);
  }, [pairs, query]);

  function handleSelect(symbol: string) {
    onSelect(symbol);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="bg-void-soft border border-void-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-neon-blue/50 w-full sm:w-64"
        />
      </div>

      {isOpen && query.trim().length >= 1 && (
        <div className="absolute z-20 top-full mt-1.5 w-72 max-h-80 overflow-y-auto panel border-void-border shadow-2xl">
          {isLoading && <div className="px-4 py-3 text-xs text-slate-500">Cargando pares de Binance…</div>}
          {isError && <div className="px-4 py-3 text-xs text-neon-red">No se pudo cargar la lista de pares.</div>}
          {results.length === 0 && !isLoading && (
            <div className="px-4 py-3 text-xs text-slate-500">Sin resultados para "{query}" en Binance USDT.</div>
          )}
          {results.map((p) => {
            const base = p.symbol.replace("USDT", "");
            const precision = pricePrecision(p.lastPrice);
            const up = p.priceChangePercent >= 0;
            return (
              <button
                key={p.symbol}
                onMouseDown={() => handleSelect(p.symbol)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors border-b border-void-border/50 last:border-0"
              >
                <div className="min-w-0">
                  <div className="text-sm text-slate-100 font-mono">{base}/USDT</div>
                  <div className="text-[10px] text-slate-500 font-mono">Vol 24h {formatUsd(p.quoteVolume, 0)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="value-mono text-xs text-slate-200">{formatUsd(p.lastPrice, precision)}</div>
                  <div className={`value-mono text-[10px] ${up ? "text-neon-green" : "text-neon-red"}`}>
                    {up ? "+" : ""}
                    {p.priceChangePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
