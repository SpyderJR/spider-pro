const STEPS = [
  { x: 50, y: 110, label: "$63,000.00" },
  { x: 100, y: 92, label: "$63,000.01" },
  { x: 150, y: 74, label: "$63,000.02" },
  { x: 200, y: 56, label: "$63,000.03" },
  { x: 250, y: 38, label: "$63,000.04" },
];

export function EscalonesTick() {
  return (
    <svg viewBox="0 0 400 150" className="w-full h-auto" role="img" aria-label="El precio sube en escalones mínimos, no de forma continua">
      <line x1={10} y1={130} x2={390} y2={130} stroke="#334155" strokeWidth={1} />
      <line x1={10} y1={130} x2={10} y2={15} stroke="#334155" strokeWidth={1} />

      {STEPS.map((s, i) => {
        if (i === 0) return null;
        const prev = STEPS[i - 1]!;
        return (
          <g key={`step-${i}`}>
            <line x1={prev.x} y1={prev.y} x2={s.x} y2={prev.y} stroke="#39ff9c" strokeWidth={2.5} />
            <line x1={s.x} y1={prev.y} x2={s.x} y2={s.y} stroke="#39ff9c" strokeWidth={2.5} />
          </g>
        );
      })}

      {STEPS.map((s, i) => (
        <g key={`dot-${i}`}>
          <circle cx={s.x} cy={s.y} r={3.5} fill="#39ff9c" />
          <text x={s.x} y={s.y - 10} textAnchor="middle" fontFamily="monospace" fontSize={8.5} fill="#e2e8f0">
            {s.label}
          </text>
        </g>
      ))}

      <text x={300} y={95} fontFamily="monospace" fontSize={9} fill="#94a3b8">
        cada escalón =
      </text>
      <text x={300} y={107} fontFamily="monospace" fontSize={9} fill="#ffcf4d" fontWeight="bold">
        1 tick ($0.01)
      </text>
    </svg>
  );
}
