import { useState } from "react";
import type { WhaleDetail } from "@spider/types";
import { WhaleAvatar } from "./WhaleAvatar";
import { CATEGORY_COLORS, CATEGORY_LABELS, CHAIN_COLORS, CONFIDENCE_COLORS, CONFIDENCE_LABELS } from "../../lib/whales";
import { formatUsd } from "../../lib/format";

function shortAddress(address: string): string {
  return address.length > 14 ? `${address.slice(0, 8)}…${address.slice(-6)}` : address;
}

function explorerUrl(chain: string, address: string): string {
  switch (chain) {
    case "BTC":
      return `https://mempool.space/address/${address}`;
    case "ETH":
      return `https://etherscan.io/address/${address}`;
    case "TRON":
      return `https://tronscan.org/#/address/${address}`;
    case "SOL":
      return `https://solscan.io/account/${address}`;
    default:
      return "#";
  }
}

interface Row {
  chain: string;
  symbol: string;
  amount: number;
  usdValue: number | null;
  address: string;
}

export function WhaleDetailPanel({ entity }: { entity: WhaleDetail }) {
  const [tab, setTab] = useState<"portfolio" | "chains">("portfolio");

  const rows: Row[] = entity.balances.flatMap((b) => {
    const nativeRow: Row[] =
      b.nativeAmount !== null ? [{ chain: b.chain, symbol: b.nativeSymbol, amount: b.nativeAmount, usdValue: b.nativeUsdValue, address: b.address }] : [];
    const tokenRows: Row[] = b.tokens.map((t) => ({ chain: b.chain, symbol: t.symbol, amount: t.amount, usdValue: t.usdValue, address: b.address }));
    return [...nativeRow, ...tokenRows];
  });
  const sortedRows = [...rows].sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));

  const chainTotals = entity.balances.map((b) => ({ chain: b.chain, usdValue: b.usdValue ?? 0 }));
  const grandTotal = chainTotals.reduce((sum, c) => sum + c.usdValue, 0);

  return (
    <div className="panel p-6">
      {/* Header — mismo layout que la referencia: avatar circular, nombre, cifra grande, tags. */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <WhaleAvatar emoji={entity.avatarEmoji} color={entity.avatarColor} size={72} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{entity.name}</h2>
              <span className="text-xs" style={{ color: CATEGORY_COLORS[entity.category] }}>
                ◆
              </span>
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-2">
              {entity.dataMode === "declared" ? "CIFRA DECLARADA PÚBLICAMENTE" : "VALOR EN DIRECCIONES RASTREADAS (NO ES SU PATRIMONIO TOTAL)"}
            </div>
            <div className="value-mono text-3xl font-bold text-white">
              {entity.totalUsdValue !== null ? formatUsd(entity.totalUsdValue, 0) : "Sin cifra verificable en vivo"}
            </div>
          </div>
        </div>
        <a
          href={entity.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg border border-void-border text-slate-400 hover:text-neon-blue hover:border-neon-blue/40"
        >
          ↗ FUENTE
        </a>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        <span
          className="text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border"
          style={{ borderColor: `${CATEGORY_COLORS[entity.category]}50`, color: CATEGORY_COLORS[entity.category] }}
        >
          {CATEGORY_LABELS[entity.category]}
        </span>
        <span
          className="text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border"
          style={{ borderColor: `${CONFIDENCE_COLORS[entity.confidence]}50`, color: CONFIDENCE_COLORS[entity.confidence] }}
        >
          {CONFIDENCE_LABELS[entity.confidence]}
        </span>
        {entity.tags.map((t) => (
          <span key={t} className="text-[9px] font-mono px-2 py-1 rounded-full border border-void-border text-slate-400">
            {t}
          </span>
        ))}
      </div>

      {entity.declaredNote && (
        <div className="mb-5 bg-neon-gold/5 border border-neon-gold/25 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
          <strong className="text-neon-gold">Nota: </strong>
          {entity.declaredNote}
        </div>
      )}

      {entity.externalEstimateNote && (
        <div className="mb-5 bg-neon-red/5 border border-neon-red/25 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
          <strong className="text-neon-red">Su patrimonio real es mucho mayor a lo que rastreamos: </strong>
          {entity.externalEstimateNote}
        </div>
      )}

      {entity.dataMode === "onchain" && (
        <div className="mb-5 bg-neon-blue/5 border border-neon-blue/25 rounded-lg p-3 text-xs text-slate-300 leading-relaxed flex gap-2">
          <span className="text-neon-blue shrink-0">ⓘ</span>
          <span>
            Este número es la suma de <strong className="text-white">{entity.balances.length}</strong> dirección
            {entity.balances.length !== 1 ? "es" : ""} pública{entity.balances.length !== 1 ? "s" : ""} verificada
            {entity.balances.length !== 1 ? "s" : ""} — <strong className="text-white">no el patrimonio total</strong> de
            esta persona o empresa. Alguien con fama pública puede tener su fortuna repartida en muchas más wallets
            que nunca se confirmaron públicamente con una fuente citable; mostrar esas cifras sin poder verificarlas
            iría contra la regla de este módulo de nunca inventar un dato.
          </span>
        </div>
      )}

      {entity.balances.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-mono text-slate-500 mb-2">DISTRIBUCIÓN POR RED</div>
          <div className="h-2.5 rounded-full overflow-hidden flex bg-void-soft border border-void-border">
            {chainTotals.map((c) => (
              <div
                key={c.chain}
                style={{
                  width: grandTotal > 0 ? `${(c.usdValue / grandTotal) * 100}%` : `${100 / chainTotals.length}%`,
                  background: CHAIN_COLORS[c.chain as keyof typeof CHAIN_COLORS],
                }}
                title={`${c.chain}: ${formatUsd(c.usdValue, 0)}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {chainTotals.map((c) => (
              <div key={c.chain} className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className="w-2 h-2 rounded-full" style={{ background: CHAIN_COLORS[c.chain as keyof typeof CHAIN_COLORS] }} />
                <span className="text-slate-400">{c.chain}</span>
                <span className="text-slate-600">{grandTotal > 0 ? `${((c.usdValue / grandTotal) * 100).toFixed(1)}%` : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entity.balances.length > 0 && (
        <>
          <div className="flex gap-1.5 mb-3 border-b border-void-border">
            {(["portfolio", "chains"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-xs font-mono border-b-2 -mb-px transition-colors ${
                  tab === t ? "border-neon-green text-neon-green" : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "portfolio" ? "PORTFOLIO" : "DIRECCIONES POR RED"}
              </button>
            ))}
          </div>

          {tab === "portfolio" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-void-border">
                    <th className="py-2 pr-3">ACTIVO</th>
                    <th className="py-2 pr-3">RED</th>
                    <th className="py-2 pr-3 text-right">HOLDINGS</th>
                    <th className="py-2 pr-3 text-right">VALOR</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((r, i) => (
                    <tr key={`${r.chain}-${r.symbol}-${i}`} className="border-b border-void-border/50 last:border-0">
                      <td className="py-2 pr-3 font-mono font-bold text-slate-200">{r.symbol}</td>
                      <td className="py-2 pr-3">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: `${CHAIN_COLORS[r.chain as keyof typeof CHAIN_COLORS]}50`, color: CHAIN_COLORS[r.chain as keyof typeof CHAIN_COLORS] }}>
                          {r.chain}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-right value-mono text-slate-300">
                        {r.amount.toLocaleString("es-MX", { maximumFractionDigits: r.amount < 1 ? 6 : 2 })}
                      </td>
                      <td className="py-2 pr-3 text-right value-mono text-white font-semibold">
                        {r.usdValue !== null ? formatUsd(r.usdValue, 0) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-2">
              {entity.balances.map((b) => (
                <a
                  key={b.address}
                  href={explorerUrl(b.chain, b.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-void-border hover:border-neon-blue/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: `${CHAIN_COLORS[b.chain]}50`, color: CHAIN_COLORS[b.chain] }}>
                      {b.chain}
                    </span>
                    <span className="text-xs font-mono text-slate-300">{shortAddress(b.address)}</span>
                  </div>
                  <span className="value-mono text-xs text-white">{b.usdValue !== null ? formatUsd(b.usdValue, 0) : "—"}</span>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-5 pt-4 border-t border-void-border text-[10px] text-slate-600 leading-relaxed">{entity.sourceNote}</div>
    </div>
  );
}
