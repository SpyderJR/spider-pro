import { useEffect, useState } from "react";
import type { ClusterGroup, MemeHolder, MemeTransfer } from "@spider/types";
import { useBubbleLayout } from "../../hooks/useBubbleLayout";
import type { LayoutNode } from "../../lib/meme/forceLayout";

const WIDTH = 640;
const HEIGHT = 360;

const GROUP_COLORS = ["#39ff9c", "#ffcf4d", "#3ba8ff", "#ff3b5c", "#c084fc", "#fb923c"];

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function openInTronscan(address: string) {
  window.open(`https://tronscan.org/#/address/${address}`, "_blank", "noopener,noreferrer");
}

interface Edge {
  from: string;
  to: string;
  totalAmount: number;
  count: number;
}

function buildEdges(transfers: MemeTransfer[], holderAddresses: Set<string>): Edge[] {
  const edgeMap = new Map<string, Edge>();
  for (const t of transfers) {
    if (t.from === t.to) continue;
    if (!holderAddresses.has(t.from) || !holderAddresses.has(t.to)) continue;
    // Undirected key — two holders swapping the token back and forth is still "one connection".
    const key = [t.from, t.to].sort().join("|");
    const existing = edgeMap.get(key);
    if (existing) {
      existing.totalAmount += t.amount;
      existing.count += 1;
    } else {
      edgeMap.set(key, { from: t.from, to: t.to, totalAmount: t.amount, count: 1 });
    }
  }
  return Array.from(edgeMap.values());
}

interface Props {
  holders: MemeHolder[];
  clustering: ClusterGroup[] | null;
  transfers: MemeTransfer[] | null;
}

export function HolderBubbleMap({ holders, clustering, transfers }: Props) {
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
  const nodeByAddress = new Map((nodes ?? []).map((n) => [n.id, n]));
  const edges = transfers ? buildEdges(transfers, new Set(holders.map((h) => h.address))) : [];

  if (holders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs text-slate-500 font-mono">
        Sin holders para mostrar todavía.
      </div>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="Mapa de burbujas de holders — tamaño proporcional al balance, líneas indican transferencias reales entre ellos"
      >
        {edges.map((e) => {
          const a = nodeByAddress.get(e.from);
          const b = nodeByAddress.get(e.to);
          if (!a || !b) return null;
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#ffcf4d"
              strokeWidth={Math.min(3, 0.5 + e.count)}
              strokeOpacity={0.35}
            >
              <title>
                {shortAddress(e.from)} ↔ {shortAddress(e.to)} — {e.count} transferencia{e.count > 1 ? "s" : ""},{" "}
                {e.totalAmount.toLocaleString("es-MX", { maximumFractionDigits: 0 })} tokens
              </title>
            </line>
          );
        })}
        {nodes?.map((n) => {
          const holder = holderByAddress.get(n.id);
          const color = n.group ? GROUP_COLORS[groupIds.indexOf(n.group) % GROUP_COLORS.length] : "#64748b";
          return (
            <g key={n.id} onClick={() => openInTronscan(n.id)} className="cursor-pointer">
              <circle cx={n.x} cy={n.y} r={n.radius} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5}>
                <title>
                  {shortAddress(n.id)} — {holder ? holder.balance.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : ""}
                  {holder?.percentage != null ? ` (${holder.percentage.toFixed(2)}%)` : ""} · clic para ver en Tronscan
                </title>
              </circle>
              {n.radius > 14 && (
                <text
                  x={n.x}
                  y={n.y + 3}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize={8}
                  fill={color}
                  style={{ pointerEvents: "none" }}
                >
                  {shortAddress(n.id)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="text-[10px] font-mono text-slate-500">
          {edges.length > 0
            ? `${edges.length} conexión${edges.length > 1 ? "es" : ""} directa${edges.length > 1 ? "s" : ""} detectada${edges.length > 1 ? "s" : ""} entre estos holders`
            : "Sin transferencias directas detectadas entre estos holders todavía"}
        </span>
        {clustering &&
          clustering.map((g, i) => (
            <span
              key={g.fundingSource}
              className="text-[10px] font-mono px-2 py-1 rounded border"
              style={{ borderColor: GROUP_COLORS[i % GROUP_COLORS.length], color: GROUP_COLORS[i % GROUP_COLORS.length] }}
            >
              Grupo {i + 1}: {g.memberAddresses.length} carteras, mismo origen de fondeo
            </span>
          ))}
      </div>
    </div>
  );
}
