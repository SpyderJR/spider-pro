import type { WhaleEntity } from "@spider/types";
import { WhaleAvatar } from "./WhaleAvatar";
import { CHAIN_COLORS, CONFIDENCE_COLORS } from "../../lib/whales";
import { formatCompactUsd } from "../../lib/format";

interface Props {
  entity: WhaleEntity;
  selected: boolean;
  onSelect: () => void;
}

export function WhaleCard({ entity, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 rounded-xl border transition-all w-full ${
        selected ? "border-neon-green/50 bg-neon-green/5 shadow-neon-green" : "border-void-border hover:border-slate-600 bg-void-soft/40"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <WhaleAvatar emoji={entity.avatarEmoji} color={entity.avatarColor} size={44} />
        <div className="min-w-0">
          <div className="text-sm font-bold text-white truncate">{entity.name}</div>
          <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: CONFIDENCE_COLORS[entity.confidence] }}>
            {entity.dataMode === "declared" ? "TENENCIA DECLARADA" : "EN VIVO ON-CHAIN"}
          </div>
        </div>
      </div>

      <div className="value-mono text-xl font-bold text-white mb-2">
        {entity.totalUsdValue !== null ? formatCompactUsd(entity.totalUsdValue) : "—"}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {entity.chains.map((chain) => (
          <span
            key={chain}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
            style={{ borderColor: `${CHAIN_COLORS[chain]}50`, color: CHAIN_COLORS[chain] }}
          >
            {chain}
          </span>
        ))}
        {entity.chains.length === 0 && <span className="text-[9px] font-mono text-slate-600">sin dirección on-chain</span>}
      </div>
    </button>
  );
}
