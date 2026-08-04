interface NodeDef {
  x: number;
  y: number;
  r: number;
  label: string;
  sublabel?: string;
}

const CENTER: NodeDef = { x: 210, y: 100, r: 26, label: "CARTERA X" };
const INFLOWS: NodeDef[] = [
  { x: 40, y: 40, r: 14, label: "Ballena A" },
  { x: 40, y: 160, r: 10, label: "Cartera B" },
];
const OUTFLOWS: NodeDef[] = [
  { x: 380, y: 40, r: 18, label: "Exchange", sublabel: "(entra a la orden)" },
  { x: 380, y: 160, r: 8, label: "Cartera C" },
];

function FlowLine({ from, to, color, width }: { from: NodeDef; to: NodeDef; color: string; width: number }) {
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={width} opacity={0.85} strokeLinecap="round" />;
}

function Node({ node, color }: { node: NodeDef; color: string }) {
  return (
    <g>
      <circle cx={node.x} cy={node.y} r={node.r} fill="#0a0d14" stroke={color} strokeWidth={1.8} />
      <text x={node.x} y={node.y + node.r + 13} textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#cbd5e1">
        {node.label}
      </text>
      {node.sublabel && (
        <text x={node.x} y={node.y + node.r + 24} textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#64748b">
          {node.sublabel}
        </text>
      )}
    </g>
  );
}

export function GrafoDeFlujos() {
  return (
    <svg viewBox="0 0 420 200" className="w-full h-auto" role="img" aria-label="Grafo simplificado de flujos entre carteras — verde entra, rojo sale, grosor indica tamaño">
      {INFLOWS.map((n, i) => (
        <FlowLine key={`in-${i}`} from={n} to={CENTER} color="#39ff9c" width={i === 0 ? 4 : 1.5} />
      ))}
      {OUTFLOWS.map((n, i) => (
        <FlowLine key={`out-${i}`} from={CENTER} to={n} color="#ff3b5c" width={i === 0 ? 5 : 1.5} />
      ))}

      {INFLOWS.map((n, i) => (
        <Node key={`in-node-${i}`} node={n} color="#39ff9c" />
      ))}
      {OUTFLOWS.map((n, i) => (
        <Node key={`out-node-${i}`} node={n} color="#ff3b5c" />
      ))}
      <Node node={CENTER} color="#3ba8ff" />

      <text x={210} y={186} textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#94a3b8">
        grosor de la línea = tamaño de la transacción · verde = entra · rojo = sale
      </text>
    </svg>
  );
}
