import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { GLOSSARY, type GlossaryTerm } from "../data/glossary";

const CATEGORIES = ["Todas", ...Array.from(new Set(GLOSSARY.map((g) => g.category)))] as const;

export function GlosarioPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todas");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      const matchesCategory = category === "Todas" || g.category === category;
      const matchesQuery = q === "" || g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    }).sort((a, b) => a.term.localeCompare(b.term, "es"));
  }, [query, category]);

  return (
    <div>
      <SectionHeader title="Glosario" subtitle={`${GLOSSARY.length} términos de trading y cripto explicados de forma simple y directa.`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar un término…"
          className="flex-1 bg-void-soft border border-void-border rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-neon-green/50"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-void-soft border border-void-border rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-neon-green/50"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-8 text-center text-slate-500 text-sm mb-6">No encontramos ningún término con esa búsqueda.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {filtered.map((g: GlossaryTerm) => (
            <div key={g.term} className="panel p-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h3 className="text-sm font-bold text-white">{g.term}</h3>
                <span className="badge text-[9px] text-slate-500 border-void-border shrink-0">{g.category}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{g.definition}</p>
            </div>
          ))}
        </div>
      )}

      <Disclaimer text="Este glosario es contexto educativo general, no asesoría financiera (NFA)." />
    </div>
  );
}
