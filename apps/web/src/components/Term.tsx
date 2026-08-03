import { useState, type ReactNode } from "react";
import { GLOSSARY } from "../data/glossary";

const GLOSSARY_BY_TERM = new Map(GLOSSARY.map((g) => [g.term.toLowerCase(), g]));

interface Props {
  /** Glossary entry to look up (case-insensitive). Defaults to the rendered text if omitted. */
  term?: string;
  children: ReactNode;
}

/** Underlines a term and shows its glossary definition in a tooltip on hover/tap. */
export function Term({ term, children }: Props) {
  const [open, setOpen] = useState(false);
  const lookupKey = (term ?? (typeof children === "string" ? children : "")).toLowerCase();
  const entry = GLOSSARY_BY_TERM.get(lookupKey);

  if (!entry) return <>{children}</>;

  return (
    <span
      className="relative border-b border-dotted border-neon-blue/50 text-neon-blue cursor-help"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {children}
      {open && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 panel p-3 text-xs text-slate-300 font-normal normal-case shadow-2xl">
          <span className="block text-[10px] font-mono text-neon-blue mb-1">{entry.term.toUpperCase()}</span>
          {entry.definition}
        </span>
      )}
    </span>
  );
}
