import type { ContentBlock } from "../../../content/academy/types";

type Data = Extract<ContentBlock, { type: "tabla" }>;

export function Tabla({ data }: { data: Data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-void-border">
            {data.headers.map((h) => (
              <th key={h} className="py-2 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.filas.map((fila, i) => (
            <tr key={i} className="border-b border-void-border/50 last:border-0">
              {fila.map((cell, j) => (
                <td key={j} className={`py-2 pr-4 ${j === 0 ? "text-slate-200 font-medium" : "value-mono text-slate-400"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
