// Minimal flat SVG illustrations for the simple-analogy column of each concept card —
// deliberately simple shapes, not photorealistic, matching the app's neon palette.

export function AppleIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Manzana">
      <path d="M60 30 Q45 10 30 22 Q20 30 25 45 Q30 65 60 85 Q90 65 95 45 Q100 30 90 22 Q75 10 60 30Z" fill="#ef4444" opacity={0.85} />
      <rect x={57} y={14} width={5} height={16} rx={2} fill="#a3a3a3" />
      <path d="M62 18 Q72 10 78 18" stroke="#22c55e" strokeWidth={4} fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function HandshakeBetIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Apuesta sobre el precio">
      <text x={60} y={45} textAnchor="middle" fontSize={30} fill="#3ba8ff">
        ?
      </text>
      <path d="M20 65 L45 55 L55 60 L45 68 Z" fill="#3ba8ff" opacity={0.8} />
      <path d="M100 65 L75 55 L65 60 L75 68 Z" fill="#3ba8ff" opacity={0.8} />
      <text x={60} y={90} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#94a3b8">
        precio mañana
      </text>
    </svg>
  );
}

export function ElevatorIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Ascensor">
      <rect x={40} y={10} width={40} height={80} rx={3} fill="none" stroke="#475569" strokeWidth={2} />
      <rect x={44} y={35} width={32} height={30} rx={2} fill="#12171f" stroke="#64748b" />
      <path d="M60 20 L52 30 L68 30 Z" fill="#22c55e" />
      <path d="M60 80 L52 70 L68 70 Z" fill="#ef4444" />
    </svg>
  );
}

export function LeverIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Palanca">
      <polygon points="55,70 65,70 60,55" fill="#64748b" />
      <line x1={15} y1={82} x2={105} y2={35} stroke="#ffcf4d" strokeWidth={5} strokeLinecap="round" />
      <circle cx={15} cy={82} r={7} fill="#22c55e" />
      <circle cx={105} cy={35} r={10} fill="#ef4444" />
    </svg>
  );
}

export function SkatesIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Patines en alquiler">
      <rect x={20} y={40} width={35} height={14} rx={5} fill="#3ba8ff" />
      <circle cx={28} cy={58} r={6} fill="#334155" />
      <circle cx={47} cy={58} r={6} fill="#334155" />
      <rect x={65} y={40} width={35} height={14} rx={5} fill="#3ba8ff" />
      <circle cx={73} cy={58} r={6} fill="#334155" />
      <circle cx={92} cy={58} r={6} fill="#334155" />
      <text x={60} y={22} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#94a3b8">
        depósito: $20
      </text>
    </svg>
  );
}

export function LavaFloorIcon({ leverageLabel }: { leverageLabel: string }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="El piso es lava">
      <rect x={0} y={70} width={120} height={30} fill="#ef4444" opacity={0.85} />
      <path d="M0 70 Q15 62 30 70 Q45 78 60 70 Q75 62 90 70 Q105 78 120 70 L120 100 L0 100Z" fill="#f97316" opacity={0.6} />
      <circle cx={60} cy={40} r={10} fill="#e2e8f0" />
      <rect x={52} y={50} width={16} height={18} rx={4} fill="#e2e8f0" />
      <text x={60} y={94} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#12171f" fontWeight="bold">
        {leverageLabel}
      </text>
    </svg>
  );
}

export function ClockRentIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Renta cada 8 horas">
      <circle cx={60} cy={50} r={35} fill="none" stroke="#a78bfa" strokeWidth={3} />
      <line x1={60} y1={50} x2={60} y2={25} stroke="#a78bfa" strokeWidth={3} strokeLinecap="round" />
      <line x1={60} y1={50} x2={78} y2={58} stroke="#a78bfa" strokeWidth={3} strokeLinecap="round" />
      <text x={60} y={95} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#94a3b8">
        cada 8 horas
      </text>
    </svg>
  );
}

export function ScaleIcon() {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-24" role="img" aria-label="Balanza de riesgo">
      <line x1={60} y1={15} x2={60} y2={70} stroke="#64748b" strokeWidth={3} />
      <line x1={20} y1={30} x2={100} y2={30} stroke="#64748b" strokeWidth={3} />
      <line x1={20} y1={30} x2={12} y2={50} stroke="#64748b" strokeWidth={2} />
      <line x1={100} y1={30} x2={108} y2={50} stroke="#64748b" strokeWidth={2} />
      <circle cx={12} cy={55} r={12} fill="#22c55e" opacity={0.85} />
      <circle cx={108} cy={55} r={12} fill="#3ba8ff" opacity={0.85} />
      <rect x={45} y={70} width={30} height={10} fill="#475569" />
      <text x={12} y={80} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="#22c55e">
        riesgo
      </text>
      <text x={108} y={80} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="#3ba8ff">
        margen
      </text>
    </svg>
  );
}
