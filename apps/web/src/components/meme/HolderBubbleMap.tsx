import { useEffect, useState } from "react";
import type { ClusterGroup, MemeHolder, MemeTransfer } from "@spider/types";
import { useBubbleLayout } from "../../hooks/useBubbleLayout";
import type { LayoutNode } from "../../lib/meme/forceLayout";

const WIDTH = 640;
const HEIGHT = 360;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADAR_RADIUS = Math.min(WIDTH, HEIGHT) / 2 - 10;

const GROUP_COLORS = ["#39ff9c", "#ffcf4d", "#3ba8ff", "#ff3b5c", "#c084fc", "#fb923c"];
const DEFAULT_COLOR = "#3ba8ff";

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
  // Same top-10-by-balance set the concentration risk signal is calculated from — labeling
  // exactly those bubbles (not all of them) keeps the map readable while surfacing the number
  // that actually drives the "riesgo alto/medio/bajo" badge shown elsewhere on the page.
  const top10Ids = new Set(
    [...holders]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10)
      .map((h) => h.address),
  );

  if (holders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs text-slate-500 font-mono">
        Sin holders para mostrar todavía.
      </div>
    );
  }

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_center,#0d1420_0%,#05070b_75%)] border border-void-border">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="Mapa de burbujas de holders — tamaño proporcional al balance, líneas indican transferencias reales entre ellos"
        >
          <defs>
            <filter id="bubble-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="radar-sweep-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#39ff9c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#39ff9c" stopOpacity="0" />
            </radialGradient>
            {nodes?.map((n) => {
              const holder = holderByAddress.get(n.id);
              const color = n.group ? GROUP_COLORS[groupIds.indexOf(n.group) % GROUP_COLORS.length]! : DEFAULT_COLOR;
              return (
                <radialGradient key={n.id} id={`bubble-fill-${n.id}`} cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor={color} stopOpacity={holder ? 0.55 : 0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                </radialGradient>
              );
            })}
          </defs>

          {/* Radar backdrop — concentric rings + crosshair, reinforces "Meme Radar" and gives the map a scanner feel instead of a flat scatter plot. */}
          <g stroke="#1b2230" strokeWidth={1} fill="none">
            {[0.33, 0.66, 1].map((f) => (
              <circle key={f} cx={CENTER_X} cy={CENTER_Y} r={RADAR_RADIUS * f} />
            ))}
            <line x1={CENTER_X - RADAR_RADIUS} y1={CENTER_Y} x2={CENTER_X + RADAR_RADIUS} y2={CENTER_Y} />
            <line x1={CENTER_X} y1={CENTER_Y - RADAR_RADIUS} x2={CENTER_X} y2={CENTER_Y + RADAR_RADIUS} />
          </g>
          <g
            className="animate-radar-sweep"
            style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}
          >
            <path
              d={`M ${CENTER_X} ${CENTER_Y} L ${CENTER_X + RADAR_RADIUS} ${CENTER_Y} A ${RADAR_RADIUS} ${RADAR_RADIUS} 0 0 1 ${CENTER_X + RADAR_RADIUS * Math.cos(Math.PI / 6)} ${CENTER_Y + RADAR_RADIUS * Math.sin(Math.PI / 6)} Z`}
              fill="url(#radar-sweep-gradient)"
            />
          </g>

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
                strokeOpacity={0.55}
                strokeDasharray="6 6"
                className="animate-dash-flow"
                filter="url(#bubble-glow)"
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
            const color = n.group ? GROUP_COLORS[groupIds.indexOf(n.group) % GROUP_COLORS.length]! : DEFAULT_COLOR;
            const isTop10 = top10Ids.has(n.id);
            const percentLabel = holder?.percentage != null ? `${holder.percentage < 1 ? holder.percentage.toFixed(2) : holder.percentage.toFixed(1)}%` : null;
            // Only label the percentage directly on the bubble when it's both a top-10 holder
            // (the set the risk signal actually uses) and big enough to fit readable text —
            // smaller bubbles keep the plain center dot, with the exact number still in the tooltip.
            const showPercentOnBubble = isTop10 && percentLabel && n.radius >= 11;
            return (
              <g
                key={n.id}
                onClick={() => openInTronscan(n.id)}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.radius}
                  fill={`url(#bubble-fill-${n.id})`}
                  stroke={color}
                  strokeWidth={isTop10 ? 2 : 1.5}
                  filter="url(#bubble-glow)"
                />
                {showPercentOnBubble ? (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="monospace"
                    fontSize={Math.min(13, Math.max(8, n.radius * 0.4))}
                    fontWeight="bold"
                    fill="#ffffff"
                    style={{ pointerEvents: "none" }}
                  >
                    {percentLabel}
                    <title>
                      {shortAddress(n.id)} — {holder ? holder.balance.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : ""}
                      {percentLabel ? ` (${percentLabel} del supply)` : ""} · top 10 holder · clic para ver en Tronscan
                    </title>
                  </text>
                ) : (
                  <circle cx={n.x} cy={n.y} r={Math.max(1.5, n.radius * 0.08)} fill={color}>
                    <title>
                      {shortAddress(n.id)} — {holder ? holder.balance.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : ""}
                      {percentLabel ? ` (${percentLabel})` : ""} · clic para ver en Tronscan
                    </title>
                  </circle>
                )}
                {n.radius > 14 && (
                  <text
                    x={n.x}
                    y={n.y + n.radius + 11}
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
      </div>
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
