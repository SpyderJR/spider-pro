import { useEffect, useRef, useState } from "react";
import type { MemeTokenSummary } from "@spider/types";
import { fetchMemeToken } from "../lib/api";

const POLL_MS = 30_000;

export function useMemeToken(address: string | null) {
  const [token, setToken] = useState<MemeTokenSummary | null>(null);
  const [error, setError] = useState(false);
  const hasDataRef = useRef(false);

  useEffect(() => {
    if (!address) {
      setToken(null);
      setError(false);
      return;
    }

    let cancelled = false;
    hasDataRef.current = false;
    setToken(null);
    setError(false);

    async function poll() {
      try {
        const res = await fetchMemeToken(address!);
        if (!cancelled) {
          setToken(res);
          hasDataRef.current = true;
          setError(false);
        }
      } catch {
        if (!cancelled) setError(!hasDataRef.current);
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [address]);

  return { token, error };
}
