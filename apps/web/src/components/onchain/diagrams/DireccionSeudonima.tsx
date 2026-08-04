export function DireccionSeudonima() {
  return (
    <svg viewBox="0 0 420 160" className="w-full h-auto" role="img" aria-label="Una dirección es un seudónimo público, no un nombre real">
      <rect x={110} y={10} width={200} height={44} rx={8} fill="#0a0d14" stroke="#3ba8ff" strokeWidth={1.5} />
      <text x={210} y={28} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        DIRECCIÓN PÚBLICA
      </text>
      <text x={210} y={44} textAnchor="middle" fontFamily="monospace" fontSize={10} fill="#3ba8ff" fontWeight="bold">
        TXy8k…mQ9pZ
      </text>

      <line x1={210} y1={54} x2={210} y2={70} stroke="#334155" strokeWidth={1.5} />

      {/* lo que SÍ se ve */}
      <g>
        <rect x={20} y={72} width={175} height={82} rx={8} fill="#0a0d14" stroke="#39ff9c" strokeWidth={1.2} />
        <text x={107} y={90} textAnchor="middle" fontFamily="monospace" fontSize={8.5} fill="#39ff9c" fontWeight="bold">
          ✓ ESTO SE VE
        </text>
        <text x={32} y="106" fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Balance exacto
        </text>
        <text x={32} y={121} fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Cada transacción
        </text>
        <text x={32} y={136} fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Tokens que tiene
        </text>
        <text x={32} y={151} fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Con quién operó
        </text>
      </g>

      {/* lo que NO se ve */}
      <g>
        <rect x={225} y={72} width={175} height={82} rx={8} fill="#0a0d14" stroke="#ff3b5c" strokeWidth={1.2} />
        <text x={312} y={90} textAnchor="middle" fontFamily="monospace" fontSize={8.5} fill="#ff3b5c" fontWeight="bold">
          ✕ ESTO NO SE VE
        </text>
        <text x={237} y={106} fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Tu nombre real
        </text>
        <text x={237} y={121} fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Tu ubicación
        </text>
        <text x={237} y={136} fontFamily="monospace" fontSize={8} fill="#cbd5e1">
          · Tu identidad legal
        </text>
        <text x={237} y={151} fontFamily="monospace" fontSize={8} fill="#94a3b8">
          (salvo que tú la vincules)
        </text>
      </g>
    </svg>
  );
}
