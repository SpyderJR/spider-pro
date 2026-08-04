import { useRef, useState } from "react";
import { useTokenSearch } from "../hooks/useTokenSearch";
import type { SelectedToken } from "../store/indicatorConfigStore";

export function TokenSearchBox({ onSelect }: { onSelect: (token: SelectedToken) => void }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const search = useTokenSearch(query);

  function handleSelect(id: string, symbol: string, name: string) {
    onSelect({ symbol, coingeckoId: id, label: name });
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
          placeholder="Buscar cualquier token (ETH, SOL, DOGE…)"
          className="bg-void-soft border border-void-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-neon-blue/50 w-64"
        />
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-20 top-full mt-1.5 w-72 max-h-80 overflow-y-auto panel border-void-border shadow-2xl">
          {search.isLoading && <div className="px-4 py-3 text-xs text-slate-500">Buscando…</div>}
          {search.isError && (
            <div className="px-4 py-3 text-xs text-neon-red">No se pudo buscar. Prueba de nuevo.</div>
          )}
          {search.data && search.data.results.length === 0 && (
            <div className="px-4 py-3 text-xs text-slate-500">Sin resultados para "{query}".</div>
          )}
          {search.data?.results.map((token) => (
            <button
              key={token.id}
              onMouseDown={() => handleSelect(token.id, token.symbol, token.name)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors border-b border-void-border/50 last:border-0"
            >
              <img src={token.thumb} alt="" className="w-5 h-5 rounded-full" />
              <div className="min-w-0">
                <div className="text-sm text-slate-100 truncate">{token.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {token.symbol}
                  {token.marketCapRank ? ` · rank #${token.marketCapRank}` : ""}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
