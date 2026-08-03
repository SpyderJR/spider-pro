/** Small numbered circle + label used to mark the step sequence (1→2→3→4) in combo diagrams. */
export function NumberBadge({ n, x, y, label }: { n: number; x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={9} fill="#0e121b" stroke="#ffcf4d" strokeWidth={1.5} />
      <text textAnchor="middle" dy={3.5} fill="#ffcf4d" fontSize={10} fontFamily="monospace" fontWeight="bold">
        {n}
      </text>
      <text x={13} dy={3.5} fill="#ffcf4d" fontSize={9} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}
