/**
 * Deterministic per-address avatar (GitHub-identicon style: a symmetric 5x5 grid + a hue derived
 * from the address itself) — used whenever a token has no real image on file. Never presented as
 * the token's actual logo, just a stable visual identifier so cards don't all look identical.
 */
export interface IdenticonParams {
  hue: number;
  cells: boolean[][];
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
  const hue = hash % 360;

  // 5x5 grid, mirrored left-right for a symmetric blob — only need bits for the left 3 columns.
  const cells: boolean[][] = [];
  let bits = hash;
  for (let row = 0; row < 5; row++) {
    const rowCells: boolean[] = [];
    for (let col = 0; col < 3; col++) {
      bits = (bits * 1103515245 + 12345) & 0x7fffffff;
      rowCells.push(bits % 2 === 0);
    }
    cells.push([...rowCells, rowCells[1]!, rowCells[0]!]);
  }
  return { hue, cells };
}
