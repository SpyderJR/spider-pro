import { useEffect, useRef, useState } from "react";
import type { WhaleDetail } from "@spider/types";
import { fetchWhaleDetail } from "../lib/api";

const POLL_MS = 60_000;

export function useWhaleDetail(id: string | null) {
  const [entity, setEntity] = useState<WhaleDetail | null>(null);
  const [error, setError] = useState(false);
  const hasDataRef = useRef(false);

  useEffect(() => {
    if (!id) {
      setEntity(null);
      setError(false);
      return;
    }

    let cancelled = false;
    hasDataRef.current = false;
    setEntity(null);
    setError(false);

    async function poll() {
      try {
        const res = await fetchWhaleDetail(id!);
        if (!cancelled) {
          setEntity(res.entity);
          hasDataRef.current = true;
          setError(false);
        }
      } catch {
        if (!cancelled) setError(!hasDataRef.current);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  return { entity, error };
}
