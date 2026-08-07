import type { BacktestCondition, ConditionNode } from "@spider/types";
import { ConditionRow } from "./ConditionRow";

const DEFAULT_GROUP_CONDITION: BacktestCondition = {
  left: { indicator: "rsi", period: 14 },
  operator: "lt",
  right: { value: 30 },
};

interface Props {
  node: ConditionNode;
  onChange: (node: ConditionNode) => void;
  onRemove: () => void;
}

/** Renders a single condition row, or — when the node has a `logic` field — a group box where
 * every sub-condition is combined with AND/OR instead of the flat list's implicit AND. Converting
 * a plain condition into a group (and back) happens in place, no separate "type" toggle needed. */
export function ConditionNodeEditor({ node, onChange, onRemove }: Props) {
  if ("logic" in node) {
    return (
      <div className="rounded-lg border border-neon-gold/30 bg-neon-gold/5 p-2.5 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-neon-gold font-bold tracking-widest">GRUPO —</span>
            <select
              value={node.logic}
              onChange={(e) => onChange({ ...node, logic: e.target.value as "and" | "or" })}
              className="bg-void-panel border border-void-border rounded px-1.5 py-1 text-slate-100 outline-none focus:border-neon-blue/50"
            >
              <option value="or">se cumple con CUALQUIERA (OR)</option>
              <option value="and">se cumplen TODAS (AND)</option>
            </select>
          </div>
          <button onClick={onRemove} className="text-neon-red text-xs font-mono px-2 py-1 hover:bg-neon-red/10 rounded">
            Quitar grupo
          </button>
        </div>
        <div className="space-y-1.5">
          {node.conditions.map((c, i) => (
            <ConditionRow
              key={i}
              condition={c}
              onChange={(updated) => {
                const next = [...node.conditions];
                next[i] = updated;
                onChange({ ...node, conditions: next });
              }}
              onRemove={() => onChange({ ...node, conditions: node.conditions.filter((_, idx) => idx !== i) })}
            />
          ))}
        </div>
        <button
          onClick={() => onChange({ ...node, conditions: [...node.conditions, DEFAULT_GROUP_CONDITION] })}
          className="text-[11px] font-mono text-neon-gold hover:underline"
        >
          + condición al grupo
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <ConditionRow condition={node} onChange={onChange} onRemove={onRemove} />
      </div>
      <button
        onClick={() => onChange({ logic: "or", conditions: [node, DEFAULT_GROUP_CONDITION] })}
        title="Convertir esta condición en un grupo OR"
        className="text-[10px] font-mono text-neon-blue hover:underline whitespace-nowrap mt-2.5 shrink-0"
      >
        + grupo OR
      </button>
    </div>
  );
}
