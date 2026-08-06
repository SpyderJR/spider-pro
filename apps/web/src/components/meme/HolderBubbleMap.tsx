import { useEffect, useState } from "react";
import type { ClusterGroup, MemeHolder } from "@spider/types";
import { useBubbleLayout } from "../../hooks/useBubbleLayout";
import type { LayoutNode } from "../../lib/meme/forceLayout";

const WIDTH = 640;
const HEIGHT = 360;

const GROUP_COLORS = ["#39ff9c", "#ffcf4d", "#3ba8ff", "#ff3b5c", "#c084fc", "#fb923c"];

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

interface Props {
  holders: MemeHolder[];
  clustering: ClusterGroup[] | null;
}

export function HolderBubbleMap({ holders, clustering }: Props) {
  const { computeLayout } = useBubbleLayout();
  const [nodes, setNodes] = useState<LayoutNode[] | null>(null);

  useEffect(() => {
    if (holders.length === 0) {
      setNodes([]);
      return;
    }

    const groupByAddress = new Map<string, string>();
    (clustering ?? []).forEach((g, i) => {
      g.memberAddresses.forEach((addr) => groupByAddress.set(addr, `g${i}`));
    });

    let cancelled = false;
    computeLayout(
      holders.map((h) => ({ id: h.address, weight: h.balance, group: groupByAddress.get(h.address) ?? null })),
      WIDTH,
      HEIGHT,
    ).then((result) => {
      if (!cancelled) setNodes(result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holders, clustering]);

  const groupIds = Array.from(new Set((clustering ?? []).map((_, i) => `g${i}`)));
  const holderByAddress = new Map(holders.map((h) => [h.address, h]));

  if (holders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs text-slate-500 font-mono">
        Sin holders para mostrar todavía.
      </div>
    );
  }

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Mapa de burbujas de holders — tamaño proporcional al balance">
        {nodes?.map((n) => {
          const holder = holderByAddress.get(n.id);
          const color = n.group ? GROUP_COLORS[groupIds.indexOf(n.group) % GROUP_COLORS.length] : "#64748b";
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.radius} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5}>
                <title>
                  {shortAddress(n.id)} — {holder ? holder.balance.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : ""}
                  {holder?.percentage != null ? ` (${holder.percentage.toFixed(2)}%)` : ""}
                </title>
              </circle>
              {n.radius > 14 && (
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontFamily="monospace" fontSize={8} fill={color}>
                  {shortAddress(n.id)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {clustering && clustering.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {clustering.map((g, i) => (
            <span
              key={g.fundingSource}
              className="text-[10px] font-mono px-2 py-1 rounded border"
              style={{ borderColor: GROUP_COLORS[i % GROUP_COLORS.length], color: GROUP_COLORS[i % GROUP_COLORS.length] }}
            >
              Grupo {i + 1}: {g.memberAddresses.length} carteras, mismo origen de fondeo
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
