import { Fragment } from "react";
import { GLOSSARY } from "../data/glossary";
import { Term } from "./Term";

// Glossary terms like "Stop Loss (SL)" rarely appear verbatim in prose — index both
// the base name and the parenthetical abbreviation as separate aliases for the same entry.
const ALIAS_TO_CANONICAL = new Map<string, string>();
for (const g of GLOSSARY) {
  const parenMatch = g.term.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    ALIAS_TO_CANONICAL.set(parenMatch[1]!.trim().toLowerCase(), g.term);
    ALIAS_TO_CANONICAL.set(parenMatch[2]!.trim().toLowerCase(), g.term);
  } else {
    ALIAS_TO_CANONICAL.set(g.term.toLowerCase(), g.term);
  }
}

// Longest alias first so e.g. "Swing High" matches before a bare "High" ever could.
const ALIASES = [...ALIAS_TO_CANONICAL.keys()].sort((a, b) => b.length - a.length);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PATTERN = new RegExp(`\\b(${ALIASES.map(escapeRegExp).join("|")})\\b`, "gi");

/** Renders plain text with any glossary term inside it wrapped in a definition tooltip. */
export function TermifiedText({ text }: { text: string }) {
  const parts = text.split(PATTERN);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 !== 1) return <Fragment key={i}>{part}</Fragment>;
        const canonical = ALIAS_TO_CANONICAL.get(part.toLowerCase());
        return (
          <Term key={i} term={canonical}>
            {part}
          </Term>
        );
      })}
    </>
  );
}
