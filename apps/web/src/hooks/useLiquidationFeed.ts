import { useEffect, useRef, useState } from "react";
import { connectLiquidationStream, type LiquidationEvent } from "../lib/binance/liquidationStream";

const MAX_ITEMS = 40;
// Liquidaciones son eventos discretos, no un stream continuo de precio — no necesitan el mismo
// ritmo de refresco que kline/depth/trade, pero se agrupan igual con buffer+flush en vez de
// setState por mensaje, siguiendo la misma disciplina de rendimiento que useBinanceStreams.
const FLUSH_INTERVAL_MS = 200;

interface LiquidationFeedState {
  events: LiquidationEvent[];
  connected: boolean;
}

/** Feed en vivo de liquidaciones reales de Binance Futures — todo el mercado, no solo el par actual. */
export function useLiquidationFeed(): LiquidationFeedState {
  const [events, setEvents] = useState<LiquidationEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const pendingRef = useRef<LiquidationEvent[]>([]);
  const dirtyRef = useRef(false);

  useEffect(() => {
    pendingRef.current = [];
    dirtyRef.current = false;
    setEvents([]);
    setConnected(false);

    const disconnect = connectLiquidationStream(
      (event) => {
        pendingRef.current = [event, ...pendingRef.current].slice(0, MAX_ITEMS);
        dirtyRef.current = true;
      },
      setConnected,
    );

    const flushTimer = setInterval(() => {
      if (!dirtyRef.current) return;
      dirtyRef.current = false;
      setEvents(pendingRef.current);
    }, FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(flushTimer);
      disconnect();
    };
  }, []);

  return { events, connected };
}
