import { useChatStore } from "../../store/chatStore";

interface Props {
  question: string;
  className?: string;
}

/** Pre-carga la pregunta en Spider Chat y lo abre — conecta cada métrica con el asistente real. */
export function ExplainButton({ question, className = "" }: Props) {
  const setDraft = useChatStore((s) => s.setDraft);
  const open = useChatStore((s) => s.open);

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(question);
        open();
      }}
      className={`inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-neon-green transition-colors ${className}`}
      title="Preguntarle a Spider Chat"
    >
      💬 Explícame esto
    </button>
  );
}
