export function AnatomiaDeVela() {
  return (
    <svg viewBox="0 0 400 210" className="w-full h-auto" role="img" aria-label="Anatomía de una vela japonesa alcista y bajista">
      {/* Vela alcista (verde) */}
      <g>
        <text x={100} y={20} textAnchor="middle" fontFamily="monospace" fontSize={9.5} fill="#39ff9c" fontWeight="bold">
          VELA ALCISTA (cierre &gt; apertura)
        </text>
        <line x1={100} y1={35} x2={100} y2={175} stroke="#39ff9c" strokeWidth={1.5} />
        <rect x={78} y={70} width={44} height={80} fill="#39ff9c" fillOpacity={0.25} stroke="#39ff9c" strokeWidth={1.5} />

        <line x1={130} y1={35} x2={140} y2={35} stroke="#94a3b8" strokeWidth={1} />
        <line x1={140} y1={35} x2={140} y2={70} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
        <text x={144} y={38} fontFamily="monospace" fontSize={7.5} fill="#94a3b8">
          mecha superior (máximo)
        </text>

        <line x1={130} y1={70} x2={150} y2={70} stroke="#39ff9c" strokeWidth={1} />
        <text x={154} y={73} fontFamily="monospace" fontSize={7.5} fill="#39ff9c">
          cierre
        </text>
        <line x1={130} y1={150} x2={150} y2={150} stroke="#39ff9c" strokeWidth={1} />
        <text x={154} y={153} fontFamily="monospace" fontSize={7.5} fill="#39ff9c">
          apertura
        </text>

        <line x1={130} y1={175} x2={140} y2={175} stroke="#94a3b8" strokeWidth={1} />
        <line x1={140} y1={150} x2={140} y2={175} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
        <text x={144} y={188} fontFamily="monospace" fontSize={7.5} fill="#94a3b8">
          mecha inferior (mínimo)
        </text>

        <text x={100} y={200} textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#64748b">
          cuerpo = de apertura a cierre
        </text>
      </g>

      {/* Vela bajista (roja) */}
      <g>
        <text x={300} y={20} textAnchor="middle" fontFamily="monospace" fontSize={9.5} fill="#ff3b5c" fontWeight="bold">
          VELA BAJISTA (cierre &lt; apertura)
        </text>
        <line x1={300} y1={35} x2={300} y2={175} stroke="#ff3b5c" strokeWidth={1.5} />
        <rect x={278} y={60} width={44} height={80} fill="#ff3b5c" fillOpacity={0.25} stroke="#ff3b5c" strokeWidth={1.5} />

        <line x1={330} y1={60} x2={340} y2={60} stroke="#ff3b5c" strokeWidth={1} />
        <text x={344} y={63} fontFamily="monospace" fontSize={7.5} fill="#ff3b5c">
          apertura
        </text>
        <line x1={330} y1={140} x2={340} y2={140} stroke="#ff3b5c" strokeWidth={1} />
        <text x={344} y={143} fontFamily="monospace" fontSize={7.5} fill="#ff3b5c">
          cierre
        </text>

        <line x1={330} y1={35} x2={340} y2={35} stroke="#94a3b8" strokeWidth={1} />
        <line x1={340} y1={35} x2={340} y2={60} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
        <line x1={330} y1={175} x2={340} y2={175} stroke="#94a3b8" strokeWidth={1} />
        <line x1={340} y1={140} x2={340} y2={175} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />

        <text x={300} y={200} textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#64748b">
          mecha larga = precio visitó y fue rechazado
        </text>
      </g>
    </svg>
  );
}
