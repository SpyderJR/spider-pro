import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../../store/chatStore";
import { usePageContextStore } from "../../store/pageContextStore";
import { postChat } from "../../lib/api";

export function ChatWidget() {
  const { isOpen, toggle, close, messages, addMessage, isSending, setSending } = useChatStore();
  const { page, data } = usePageContextStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");
    addMessage({ role: "user", content: text });
    setSending(true);
    try {
      const res = await postChat(text, page || "desconocida", data, messages.slice(-10));
      addMessage({ role: "assistant", content: res.reply });
    } catch {
      addMessage({
        role: "assistant",
        content: "No pude conectar con el asistente. Probá de nuevo en unos segundos.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-neon-green/10 border border-neon-green/50 shadow-neon-green flex items-center justify-center text-2xl text-neon-green hover:bg-neon-green/20 transition-colors"
        aria-label="Abrir Spider Chat"
      >
        {isOpen ? "✕" : "◈"}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] panel shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-void-border flex items-center justify-between bg-void-soft">
            <div>
              <div className="font-mono font-semibold text-white text-sm">Spider Chat</div>
              <div className="text-[11px] text-slate-500">
                Contexto: <span className="text-neon-blue">{page || "—"}</span>
              </div>
            </div>
            <button onClick={close} className="text-slate-500 hover:text-slate-300 text-sm">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg px-3 py-2 max-w-[85%] ${
                  m.role === "user"
                    ? "bg-neon-blue/10 border border-neon-blue/30 ml-auto text-slate-100"
                    : "bg-white/5 border border-void-border text-slate-200"
                }`}
              >
                {m.content}
              </div>
            ))}
            {isSending && (
              <div className="text-xs text-slate-500 font-mono">Spider está pensando…</div>
            )}
          </div>

          <div className="p-3 border-t border-void-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Preguntale a Spider sobre esta pantalla…"
              className="flex-1 bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-neon-green/50"
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              className="bg-neon-green/10 border border-neon-green/40 text-neon-green rounded-lg px-3 text-sm disabled:opacity-40"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
