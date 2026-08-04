import type { ContentBlock } from "../../../content/academy/types";
import { TermifiedText } from "../../TermifiedText";

type Data = Extract<ContentBlock, { type: "analogia" }>;

export function Analogia({ data }: { data: Data }) {
  return (
    <div className="rounded-xl border border-neon-gold/30 bg-neon-gold/5 p-4">
      <div className="text-xs font-mono font-bold tracking-widest text-neon-gold mb-1.5">PENSALO ASÍ</div>
      <p className="text-sm text-slate-200 leading-relaxed italic">
        <TermifiedText text={data.texto} />
      </p>
    </div>
  );
}
