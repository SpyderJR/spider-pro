import type { MemeTokenSummary } from "@spider/types";
import { IdenticonAvatar } from "./IdenticonAvatar";

function formatUsd(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(n < 1 ? 6 : 2)}`;
}

interface Props {
  token: MemeTokenSummary | null;
  error: boolean;
  isWatched: boolean;
  onToggleWatch: () => void;
}

export function TokenSummaryPanel({ token, error, isWatched, onToggleWatch }: Props) {
  if (error) {
    return (
      <div className="panel p-5 border border-neon-red/30">
        <p className="text-sm text-neon-red">No se pudo cargar este token — verifica que la dirección sea correcta.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="panel p-5">
        <p className="text-sm text-slate-500 font-mono">Cargando...</p>
      </div>
    );
  }

  const isGraduated = token.status === "graduated";

  return (
    <div className={`panel p-5 ${isGraduated ? "border border-neon-green/20 shadow-neon-green" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {token.imageUrl ? (
            <img
              src={token.imageUrl}
              alt={token.symbol ?? token.address}
              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-void-border"
            />
          ) : (
            <IdenticonAvatar seed={token.address} size={40} />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white truncate">{token.name ?? "Token sin nombre"}</h3>
              {token.symbol && <span className="text-xs font-mono text-slate-500 shrink-0">{token.symbol}</span>}
            </div>
            <div className="text-[10px] font-mono text-slate-600 mt-0.5 truncate">{token.address}</div>
          </div>
        </div>
        <button
          onClick={onToggleWatch}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            isWatched
              ? "border-neon-gold/50 text-neon-gold bg-neon-gold/10"
              : "border-void-border text-slate-400 hover:border-neon-gold/40 hover:text-neon-gold"
          }`}
        >
          {isWatched ? "★ En watchlist" : "☆ Seguir"}
        </button>
      </div>

      <div className="mb-4">
        {isGraduated ? (
          <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded border border-neon-green/40 text-neon-green bg-neon-green/10">
            EN VIVO · dexscreener
          </span>
        ) : (
          <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded border border-neon-gold/40 text-neon-gold bg-neon-gold/10">
            EN CURVA DE LANZAMIENTO · aún sin pool
          </span>
        )}
      </div>

      {isGraduated ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <div className="text-[10px] font-mono text-slate-500">PRECIO</div>
            <div className="text-sm font-bold text-white">{formatUsd(token.priceUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500">LIQUIDEZ</div>
            <div className="text-sm font-bold text-white">{formatUsd(token.liquidityUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500">VOL 24H</div>
            <div className="text-sm font-bold text-white">{formatUsd(token.volume24hUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500">MARKET CAP</div>
            <div className="text-sm font-bold text-white">{formatUsd(token.marketCapUsd)}</div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          Este token todavía se está comprando/vendiendo en la curva de bonding de SunPump — no tiene un pool de
          liquidez real en SunSwap todavía, así que no hay precio de mercado verificable.
        </p>
      )}

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-void-border text-xs">
        <div>
          <span className="text-slate-500">Holders: </span>
          <span className="text-white font-mono">{token.holdersCount ?? "—"}</span>
        </div>
        {token.dexUrl && (
          <a href={token.dexUrl} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
            Ver en DexScreener ↗
          </a>
        )}
      </div>
    </div>
  );
}
