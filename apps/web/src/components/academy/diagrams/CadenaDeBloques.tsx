export function CadenaDeBloques() {
  const blocks = [1, 2, 3, 4];
  return (
    <svg viewBox="0 0 420 120" className="w-full h-auto" role="img" aria-label="Cadena de bloques">
      {blocks.map((b, i) => {
        const x = 20 + i * 100;
        return (
          <g key={b}>
            {i > 0 && <line x1={x - 20} y1={60} x2={x} y2={60} stroke="#39ff9c" strokeWidth={2} strokeDasharray="3 3" />}
            <rect x={x} y={22} width={78} height={76} rx={8} fill="#0a0d14" stroke="#39ff9c" strokeWidth={1.5} />
            <text x={x + 39} y={52} textAnchor="middle" fontFamily="monospace" fontSize={11} fill="#39ff9c" fontWeight="bold">
              BLOQUE {b}
            </text>
            <text x={x + 39} y={71} textAnchor="middle" fontFamily="monospace" fontSize={7} fill="#94a3b8">
              hash anterior
            </text>
            <text x={x + 39} y={83} textAnchor="middle" fontFamily="monospace" fontSize={7} fill="#94a3b8">
              + transacciones
            </text>
          </g>
        );
      })}
    </svg>
  );
}
