import type { ContentBlock } from "../../../content/academy/types";
import { TermifiedText } from "../../TermifiedText";

type Data = Extract<ContentBlock, { type: "destacado" }>;

const STYLES = {
  info: "border-neon-blue/40 bg-neon-blue/5 text-neon-blue",
  exito: "border-neon-green/40 bg-neon-green/5 text-neon-green",
  advertencia: "border-neon-red/40 bg-neon-red/5 text-neon-red",
};

export function Destacado({ data }: { data: Data }) {
  return (
    <div className={`rounded-xl border p-4 ${STYLES[data.variante]}`}>
      {data.titulo && <div className="text-xs font-mono font-bold tracking-widest mb-1.5">{data.titulo}</div>}
      <p className="text-sm text-slate-200 leading-relaxed">
        <TermifiedText text={data.texto} />
      </p>
    </div>
  );
}
