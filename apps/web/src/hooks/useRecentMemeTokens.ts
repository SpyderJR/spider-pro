import { useEffect, useRef, useState } from "react";
import type { RecentTokenCreation } from "@spider/types";
import { fetchRecentMemeTokens } from "../lib/api";

const POLL_MS = 30_000;

export function useRecentMemeTokens() {
  const [tokens, setTokens] = useState<RecentTokenCreation[] | null>(null);
  const [error, setError] = useState(false);
  const hasDataRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetchRecentMemeTokens();
        if (!cancelled) {
          setTokens(res.tokens);
          hasDataRef.current = true;
          setError(false);
        }
      } catch {
        // Transient failure — keep the last known feed rather than blanking it, but surface an
        // error if we never had data to begin with.
        if (!cancelled) setError(!hasDataRef.current);
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { tokens, error };
}
