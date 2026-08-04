export function CustodiaWallet() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-auto" role="img" aria-label="Custodia propia vs exchange">
      <rect x={20} y={20} width={160} height={100} rx={10} fill="#0a0d14" stroke="#39ff9c" strokeWidth={1.5} />
      <text x={100} y={45} textAnchor="middle" fontFamily="monospace" fontSize={11} fill="#39ff9c" fontWeight="bold">
        WALLET PROPIA
      </text>
      <text x={100} y={65} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        tú tienes las claves
      </text>
      <text x={100} y={82} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        "not your keys,
      </text>
      <text x={100} y={95} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        not your coins"
      </text>
      <text x={100} y={112} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#ffcf4d">
        tú eres responsable
      </text>

      <rect x={220} y={20} width={160} height={100} rx={10} fill="#0a0d14" stroke="#3ba8ff" strokeWidth={1.5} />
      <text x={300} y={45} textAnchor="middle" fontFamily="monospace" fontSize={11} fill="#3ba8ff" fontWeight="bold">
        EXCHANGE
      </text>
      <text x={300} y={65} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        el exchange tiene
      </text>
      <text x={300} y={78} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        las claves por ti
      </text>
      <text x={300} y={95} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        más cómodo
      </text>
      <text x={300} y={112} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#ff3b5c">
        confías en un tercero
      </text>
    </svg>
  );
}
