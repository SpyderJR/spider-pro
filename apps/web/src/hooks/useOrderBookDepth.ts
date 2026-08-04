import { useEffect, useMemo, useState } from "react";
import { fetchBinanceDepthSnapshot } from "../lib/binance/depth";
import type { DepthLevel, OrderBookSnapshot } from "../lib/binance/types";

const POLL_MS = 5000;

function mergeSide(base: DepthLevel[], fresh: DepthLevel[], sortDesc: boolean): DepthLevel[] {
  const freshMap = new Map(fresh.map((l) => [l.price, l.qty]));
  const merged = base.map((l) => ({ price: l.price, qty: freshMap.get(l.price) ?? l.qty }));
  const basePrices = new Set(base.map((l) => l.price));
  for (const l of fresh) {
    if (!basePrices.has(l.price)) merged.push({ price: l.price, qty: l.qty });
  }
  return merged.sort((a, b) => (sortDesc ? b.price - a.price : a.price - b.price));
}

/**
 * Polls a wider REST depth snapshot (up to 1000 levels, vs. the WS stream's top-20) and
 * patches it with the live WS top-of-book for freshness — REST supplies the wide book,
 * WS keeps the near-touch levels current between polls.
 */
export function useOrderBookDepth(symbol: string, liveTopOfBook: OrderBookSnapshot | null): OrderBookSnapshot | null {
  const [snapshot, setSnapshot] = useState<OrderBookSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSnapshot(null);

    async function poll() {
      try {
        const snap = await fetchBinanceDepthSnapshot(symbol);
        if (!cancelled) setSnapshot(snap);
      } catch {
        // Transient failure — keep the last known snapshot rather than blanking the heatmap.
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  return useMemo(() => {
    if (!snapshot) return null;
    if (!liveTopOfBook) return snapshot;
    return {
      bids: mergeSide(snapshot.bids, liveTopOfBook.bids, true),
      asks: mergeSide(snapshot.asks, liveTopOfBook.asks, false),
    };
  }, [snapshot, liveTopOfBook]);
}
