function NoisyPath({ points, color }: { points: string; color: string }) {
  return <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />;
}

export function RuidoVsATR() {
  return (
    <svg viewBox="0 0 400 190" className="w-full h-auto" role="img" aria-label="Stop dentro del ruido vs stop fuera del ruido según ATR">
      {/* Panel izquierdo: SL dentro del ruido */}
      <g>
        <rect x={8} y={10} width={184} height={170} rx={8} fill="#0a0d14" stroke="#ff3b5c" strokeWidth={1.2} />
        <text x={100} y={28} textAnchor="middle" fontFamily="monospace" fontSize={9.5} fill="#ff3b5c" fontWeight="bold">
          SL DENTRO DEL RUIDO
        </text>
        {/* noise band */}
        <rect x={25} y={80} width={150} height={40} fill="#94a3b8" opacity={0.15} />
        <text x={178} y={92} textAnchor="end" fontFamily="monospace" fontSize={7} fill="#94a3b8">
          ruido normal
        </text>
        <NoisyPath points="25,95 45,105 65,88 85,112 105,90 125,108 145,95 165,102" color="#e2e8f0" />
        {/* SL line right in the middle of the noise */}
        <line x1={25} y1={100} x2={175} y2={100} stroke="#ff3b5c" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={30} y={97} fontFamily="monospace" fontSize={7} fill="#ff3b5c">
          SL
        </text>
        <text x={100} y={140} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#ff3b5c">
          ✕ te barren por nada
        </text>
        <text x={100} y={155} textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#94a3b8">
          y el precio sigue sin ti
        </text>
      </g>

      {/* Panel derecho: SL fuera del ruido */}
      <g>
        <rect x={208} y={10} width={184} height={170} rx={8} fill="#0a0d14" stroke="#39ff9c" strokeWidth={1.2} />
        <text x={300} y={28} textAnchor="middle" fontFamily="monospace" fontSize={9.5} fill="#39ff9c" fontWeight="bold">
          SL FUERA DEL RUIDO
        </text>
        <rect x={225} y={80} width={150} height={40} fill="#94a3b8" opacity={0.15} />
        <text x={378} y={92} textAnchor="end" fontFamily="monospace" fontSize={7} fill="#94a3b8">
          ruido normal
        </text>
        <NoisyPath points="225,95 245,105 265,88 285,112 305,90 325,108 345,95 365,102" color="#e2e8f0" />
        {/* SL line below the noise band, at ATR-based distance */}
        <line x1={225} y1={135} x2={375} y2={135} stroke="#39ff9c" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={230} y={148} fontFamily="monospace" fontSize={7} fill="#39ff9c">
          SL (1.5× ATR)
        </text>
        <text x={300} y={158} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#39ff9c">
          ✓ sobrevive el ruido
        </text>
      </g>
    </svg>
  );
}
