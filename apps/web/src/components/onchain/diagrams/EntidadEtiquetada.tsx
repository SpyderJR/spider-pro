export function EntidadEtiquetada() {
  return (
    <svg viewBox="0 0 420 110" className="w-full h-auto" role="img" aria-label="Herramientas como Arkham convierten un código anónimo en una entidad reconocible">
      <rect x={10} y={30} width={150} height={50} rx={8} fill="#0a0d14" stroke="#64748b" strokeWidth={1.5} />
      <text x={85} y={52} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#94a3b8">
        TQn3…7fXpR
      </text>
      <text x={85} y={68} textAnchor="middle" fontFamily="monospace" fontSize={7} fill="#64748b">
        solo un código
      </text>

      <line x1={165} y1={55} x2={225} y2={55} stroke="#ffcf4d" strokeWidth={2} />
      <polygon points="225,50 235,55 225,60" fill="#ffcf4d" />
      <text x={195} y={42} textAnchor="middle" fontFamily="monospace" fontSize={7} fill="#ffcf4d">
        cruce de datos
      </text>

      <rect x={240} y={20} width={175} height={70} rx={8} fill="#0a0d14" stroke="#39ff9c" strokeWidth={1.5} />
      <text x={327} y={42} textAnchor="middle" fontFamily="monospace" fontSize={9} fill="#39ff9c" fontWeight="bold">
        🏦 Exchange grande
      </text>
      <text x={327} y={58} textAnchor="middle" fontFamily="monospace" fontSize={7} fill="#94a3b8">
        (cartera de depósitos)
      </text>
      <text x={327} y={75} textAnchor="middle" fontFamily="monospace" fontSize={7} fill="#ffcf4d">
        etiqueta = atribución, no certeza
      </text>
    </svg>
  );
}
