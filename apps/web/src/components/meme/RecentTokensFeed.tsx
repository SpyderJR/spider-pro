import type { RecentTokenCreation } from "@spider/types";
import { IdenticonAvatar } from "./IdenticonAvatar";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "hace instantes";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} d`;
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

interface Props {
  tokens: RecentTokenCreation[] | null;
  error: boolean;
  onSelect: (address: string) => void;
}

export function RecentTokensFeed({ tokens, error, onSelect }: Props) {
  if (error && !tokens) {
    return <p className="text-xs text-neon-red">No se pudo cargar el feed de tokens recientes.</p>;
  }

  if (!tokens) {
    return <p className="text-xs text-slate-500 font-mono">Cargando...</p>;
  }

  if (tokens.length === 0) {
    return <p className="text-xs text-slate-500">Sin creaciones recientes detectadas.</p>;
  }

  return (
    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
      {tokens.map((t, i) => (
        <button
          key={t.txId}
          onClick={() => onSelect(t.address)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-void-border hover:border-neon-blue/40 hover:shadow-neon-blue transition-all text-left group"
        >
          {t.imageUrl ? (
            <img src={t.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-void-border" />
          ) : (
            <IdenticonAvatar seed={t.address} size={32} />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono text-slate-300 group-hover:text-white transition-colors truncate">
              {shortAddress(t.address)}
            </div>
            <div className="text-[9px] font-mono text-slate-600">{timeAgo(t.createdAt)}</div>
          </div>
          {i === 0 && (
            <span className="shrink-0 flex items-center gap-1 text-[9px] font-mono font-bold text-neon-green">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              NUEVO
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
