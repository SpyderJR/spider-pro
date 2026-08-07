function MaLine({ points, color, dashed }: { points: string; color: string; dashed?: boolean }) {
  return (
    <polyline
      points={points}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeDasharray={dashed ? "4 3" : undefined}
    />
  );
}

export function CruceDeMedias() {
  return (
    <svg viewBox="0 0 400 190" className="w-full h-auto" role="img" aria-label="Golden Cross vs Death Cross — cruce de medias móviles">
      {/* Panel izquierdo: Golden Cross */}
      <g>
        <rect x={8} y={10} width={184} height={170} rx={8} fill="#0a0d14" stroke="#39ff9c" strokeWidth={1.2} />
        <text x={100} y={28} textAnchor="middle" fontFamily="monospace" fontSize={9.5} fill="#39ff9c" fontWeight="bold">
          GOLDEN CROSS
        </text>
        <MaLine points="25,140 55,132 85,120 115,105 145,88 175,72" color="#ffcf4d" />
        <text x={178} y={68} textAnchor="end" fontFamily="monospace" fontSize={7} fill="#ffcf4d">
          media corta
        </text>
        <MaLine points="25,110 55,108 85,104 115,100 145,96 175,92" color="#94a3b8" dashed />
        <text x={178} y={88} textAnchor="end" fontFamily="monospace" fontSize={7} fill="#94a3b8">
          media larga
        </text>
        <circle cx={128} cy={98} r={3.5} fill="#39ff9c" />
        <text x={100} y={158} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#39ff9c">
          ✓ corta cruza ARRIBA de la larga
        </text>
      </g>

      {/* Panel derecho: Death Cross */}
      <g>
        <rect x={208} y={10} width={184} height={170} rx={8} fill="#0a0d14" stroke="#ff3b5c" strokeWidth={1.2} />
        <text x={300} y={28} textAnchor="middle" fontFamily="monospace" fontSize={9.5} fill="#ff3b5c" fontWeight="bold">
          DEATH CROSS
        </text>
        <MaLine points="225,72 255,88 285,105 315,120 345,132 375,140" color="#ffcf4d" />
        <text x={378} y={68} textAnchor="end" fontFamily="monospace" fontSize={7} fill="#ffcf4d">
          media corta
        </text>
        <MaLine points="225,92 255,96 285,100 315,104 345,108 375,110" color="#94a3b8" dashed />
        <text x={378} y={122} textAnchor="end" fontFamily="monospace" fontSize={7} fill="#94a3b8">
          media larga
        </text>
        <circle cx={302} cy={102} r={3.5} fill="#ff3b5c" />
        <text x={300} y={158} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#ff3b5c">
          ✕ corta cruza ABAJO de la larga
        </text>
      </g>
    </svg>
  );
}
