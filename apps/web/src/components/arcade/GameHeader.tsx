import type { ReactNode } from "react";

interface Props {
  title: string;
  onExit: () => void;
  right?: ReactNode;
}

export function GameHeader({ title, onExit, right }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <div className="flex items-center gap-3">
        {right}
        <button onClick={onExit} className="text-slate-500 hover:text-slate-300 text-sm">
          ✕ Salir
        </button>
      </div>
    </div>
  );
}
