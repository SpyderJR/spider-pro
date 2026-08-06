import { useMemeWatchlistStore } from "../../store/memeWatchlistStore";
import { IdenticonAvatar } from "./IdenticonAvatar";

function shortAddress(address: string): string {
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

interface Props {
  onSelect: (address: string) => void;
}

export function WatchlistPanel({ onSelect }: Props) {
  const items = useMemeWatchlistStore((s) => s.items);
  const removeFromWatchlist = useMemeWatchlistStore((s) => s.removeFromWatchlist);

  if (items.length === 0) {
    return <p className="text-xs text-slate-500">Todavía no sigues ningún token — usa "☆ Seguir" al analizar uno.</p>;
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div
          key={item.address}
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl border border-void-border hover:border-neon-gold/30 transition-colors"
        >
          <button onClick={() => onSelect(item.address)} className="flex items-center gap-2.5 text-left flex-1 min-w-0">
            <IdenticonAvatar seed={item.address} size={28} />
            <div className="min-w-0">
              <div className="text-[11px] font-mono text-slate-300 truncate">{item.symbol ?? shortAddress(item.address)}</div>
              <div className="text-[9px] font-mono text-slate-600 truncate">{shortAddress(item.address)}</div>
            </div>
          </button>
          <button
            onClick={() => removeFromWatchlist(item.address)}
            className="shrink-0 text-slate-600 hover:text-neon-red transition-colors text-xs"
            aria-label="Quitar de watchlist"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
