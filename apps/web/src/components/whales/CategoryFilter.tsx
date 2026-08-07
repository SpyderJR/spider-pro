import type { WhaleCategory } from "@spider/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../../lib/whales";

const CATEGORIES: WhaleCategory[] = ["exchange", "institution", "political", "founder"];

interface Props {
  active: WhaleCategory | "all";
  onChange: (category: WhaleCategory | "all") => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
          active === "all" ? "border-neon-green/50 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500 hover:text-slate-300"
        }`}
      >
        Todos <span className="text-slate-600 ml-1">{counts.all ?? 0}</span>
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
            active === c ? "bg-white/10" : "border-void-border text-slate-500 hover:text-slate-300"
          }`}
          style={active === c ? { borderColor: `${CATEGORY_COLORS[c]}80`, color: CATEGORY_COLORS[c] } : undefined}
        >
          {CATEGORY_LABELS[c]} <span className="text-slate-600 ml-1">{counts[c] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
