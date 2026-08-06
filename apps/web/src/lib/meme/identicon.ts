/**
 * Deterministic per-address avatar — a two-tone gradient blob plus the address's first two
 * characters, used whenever a token has no real image on file. Never presented as the token's
 * actual logo, just a stable visual identifier so cards don't all look identical.
 */
export interface IdenticonParams {
  hueA: number;
  hueB: number;
  angle: number;
  label: string;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function identiconParams(seed: string): IdenticonParams {
  const hash = hashString(seed);
  const hueA = hash % 360;
  // Offset the second hue well away from the first so the gradient always has real contrast,
  // instead of deriving both from adjacent bits of the same LCG step (which produced
  // near-identical, flat-looking colors in an earlier version of this function).
  const hueB = (hueA + 90 + (hash % 60)) % 360;
  const angle = hash % 360;
  const label = seed.replace(/^T/, "").slice(0, 2).toUpperCase();
  return { hueA, hueB, angle, label };
}
