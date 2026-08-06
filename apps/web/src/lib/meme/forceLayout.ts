export interface LayoutInputNode {
  id: string;
  /** Relative weight (e.g. token balance) — bigger nodes push harder and settle further out. */
  weight: number;
  /** Optional cluster group id — same-group nodes attract each other slightly. */
  group: string | null;
}

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  group: string | null;
}

const ITERATIONS = 200;
const REPULSION = 4_000;
const CENTER_PULL = 0.02;
const GROUP_PULL = 0.03;
const DAMPING = 0.85;
const MIN_RADIUS = 4;
const MAX_RADIUS = 34;

/**
 * Hand-rolled force-directed layout (n-body repulsion + light center/group attraction, run for
 * a fixed number of iterations) — no graph library exists anywhere in this repo (no d3-force,
 * react-flow, sigma, cytoscape), and the rest of the project always builds visualization math by
 * hand instead of adding a dependency for it (see packages/indicators). Runs inside a Web Worker
 * (bubbleLayout.worker.ts) so 50-100 nodes don't block the UI thread.
 */
export function computeBubbleLayout(
  nodes: LayoutInputNode[],
  width: number,
  height: number,
): LayoutNode[] {
  if (nodes.length === 0) return [];

  const maxWeight = Math.max(...nodes.map((n) => n.weight), 1);
  const cx = width / 2;
  const cy = height / 2;

  const state = nodes.map((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    const spread = Math.min(width, height) / 3;
    return {
      id: n.id,
      group: n.group,
      radius: MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.sqrt(n.weight / maxWeight),
      x: cx + Math.cos(angle) * spread,
      y: cy + Math.sin(angle) * spread,
      vx: 0,
      vy: 0,
    };
  });

  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let i = 0; i < state.length; i++) {
      const a = state[i]!;
      let fx = 0;
      let fy = 0;

      for (let j = 0; j < state.length; j++) {
        if (i === j) continue;
        const b = state[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = Math.max(dx * dx + dy * dy, 1);
        const minDist = a.radius + b.radius + 4;
        const force = REPULSION / distSq;
        const dist = Math.sqrt(distSq);
        const pushed = dist < minDist ? force * 3 : force;
        fx += (dx / dist) * pushed;
        fy += (dy / dist) * pushed;

        if (a.group && a.group === b.group) {
          fx -= dx * GROUP_PULL;
          fy -= dy * GROUP_PULL;
        }
      }

      fx += (cx - a.x) * CENTER_PULL;
      fy += (cy - a.y) * CENTER_PULL;

      a.vx = (a.vx + fx) * DAMPING;
      a.vy = (a.vy + fy) * DAMPING;
    }

    for (const a of state) {
      a.x += a.vx * 0.02;
      a.y += a.vy * 0.02;
      a.x = Math.max(a.radius, Math.min(width - a.radius, a.x));
      a.y = Math.max(a.radius, Math.min(height - a.radius, a.y));
    }
  }

  return state.map((s) => ({ id: s.id, x: s.x, y: s.y, radius: s.radius, group: s.group }));
}
