import { useEffect, useRef, useState } from "react";
import type { MemeActivityEvent } from "@spider/types";
import { fetchMemeActivity } from "../lib/api";

const POLL_MS = 15_000;

export function useMemeActivity() {
  const [events, setEvents] = useState<MemeActivityEvent[] | null>(null);
  const hasDataRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetchMemeActivity();
        if (!cancelled) {
          setEvents(res.events);
          hasDataRef.current = true;
        }
      } catch {
        // Transient failure — keep the last known ticker contents rather than blanking it.
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { events };
}
