import { Link } from "react-router-dom";
import type { ContentBlock } from "../../../content/academy/types";

type Data = Extract<ContentBlock, { type: "conecta" }>;

export function Conecta({ data }: { data: Data }) {
  return (
    <Link
      to={data.to}
      className="block rounded-xl border border-neon-blue/30 bg-neon-blue/5 p-4 hover:border-neon-blue/60 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-neon-blue mb-1">PRACTICA</div>
          <div className="text-sm text-white font-medium">{data.label}</div>
          <p className="text-xs text-slate-400 mt-1">{data.descripcion}</p>
        </div>
        <span className="text-neon-blue group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}
