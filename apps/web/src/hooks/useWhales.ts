import { useEffect, useRef, useState } from "react";
import type { WhaleEntity } from "@spider/types";
import { fetchWhales } from "../lib/api";

const POLL_MS = 60_000;

export function useWhales() {
  const [entities, setEntities] = useState<WhaleEntity[] | null>(null);
  const [error, setError] = useState(false);
  const hasDataRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetchWhales();
        if (!cancelled) {
          setEntities(res.entities);
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
  }, []);

  return { entities, error };
}
