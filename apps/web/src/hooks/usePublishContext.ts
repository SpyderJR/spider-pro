import { useEffect } from "react";
import { usePageContextStore } from "../store/pageContextStore";

/** Publishes a section's verified data snapshot for the chat assistant to read. Pass a stable/serializable `data` object. */
export function usePublishContext(page: string, data: Record<string, unknown> | null) {
  const publish = usePageContextStore((s) => s.publish);

  useEffect(() => {
    if (data) publish(page, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, JSON.stringify(data)]);
}
