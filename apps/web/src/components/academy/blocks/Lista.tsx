import type { ContentBlock } from "../../../content/academy/types";
import { TermifiedText } from "../../TermifiedText";

type Data = Extract<ContentBlock, { type: "lista" }>;

const MARKERS: Record<Data["variante"], { icon: string; cls: string }> = {
  buenas: { icon: "✓", cls: "text-neon-green" },
  errores: { icon: "✕", cls: "text-neon-red" },
  neutral: { icon: "•", cls: "text-slate-400" },
};

export function Lista({ data }: { data: Data }) {
  const m = MARKERS[data.variante];
  return (
    <ul className="space-y-1.5">
      {data.items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
          <span className={`shrink-0 font-bold ${m.cls}`}>{m.icon}</span>
          <span>
            <TermifiedText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
