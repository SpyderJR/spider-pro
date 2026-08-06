import { useState } from "react";

interface Props {
  onSearch: (address: string) => void;
}

export function TokenSearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (trimmed.length > 0) onSearch(trimmed);
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Pega la dirección de un token TRC20 (empieza con T...)"
        className="flex-1 bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-blue/50"
      />
      <button
        onClick={submit}
        className="px-4 py-2 rounded-lg text-xs font-bold border border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10 transition-colors"
      >
        Analizar
      </button>
    </div>
  );
}
