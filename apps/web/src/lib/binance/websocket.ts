import { useEffect, useRef, useState } from "react";
import type { LiveKline, OrderBookSnapshot, RecentTrade, Ticker24h } from "./types";

interface StreamState {
  kline: LiveKline | null;
  ticker: Ticker24h | null;
  orderBook: OrderBookSnapshot | null;
  trades: RecentTrade[];
  connected: boolean;
}

const INITIAL_STATE: StreamState = {
  kline: null,
  ticker: null,
  orderBook: null,
  trades: [],
  connected: false,
};

// Caps how often WS messages actually reach React state. A liquid pair's combined stream (kline
// + trade + depth + ticker) can emit dozens of messages per second — re-rendering the chart,
// order book and ticker that often burns CPU on updates faster than the eye can perceive.
// ~13fps is comfortably above what's visually distinguishable and matches the 10-15fps target.
const FLUSH_INTERVAL_MS = 75;

/** Live kline + order book depth + recent trades + rolling 24h ticker, one combined Binance WS connection. */
export function useBinanceStreams(symbol: string, interval: string): StreamState {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);
  const pendingRef = useRef<StreamState>(INITIAL_STATE);
  const dirtyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    pendingRef.current = INITIAL_STATE;
    dirtyRef.current = false;
    setState(INITIAL_STATE);

    function connect() {
      if (cancelled) return;
      const s = symbol.toLowerCase();
      const streams = [`${s}@kline_${interval}`, `${s}@depth20@100ms`, `${s}@trade`, `${s}@ticker`].join("/");
      ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      // Connection status changes are rare and matter for UX feedback (the "reconectando"
      // indicator) — applied immediately rather than batched with the high-frequency data below.
      ws.onopen = () => {
        if (!cancelled) setState((prev) => ({ ...prev, connected: true }));
      };

      ws.onclose = () => {
        if (cancelled) return;
        setState((prev) => ({ ...prev, connected: false }));
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws?.close();
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        let msg: { stream: string; data: Record<string, unknown> };
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        const streamName = msg.stream;
        const data = msg.data;

        if (streamName.includes("@kline")) {
          const k = data.k as Record<string, unknown>;
          pendingRef.current = {
            ...pendingRef.current,
            kline: {
              time: Math.floor(Number(k.t) / 1000),
              open: Number(k.o),
              high: Number(k.h),
              low: Number(k.l),
              close: Number(k.c),
              volume: Number(k.v),
              isFinal: Boolean(k.x),
            },
          };
        } else if (streamName.includes("@depth")) {
          const bids = data.bids as [string, string][];
          const asks = data.asks as [string, string][];
          pendingRef.current = {
            ...pendingRef.current,
            orderBook: {
              bids: bids.map(([p, q]) => ({ price: Number(p), qty: Number(q) })).filter((l) => l.qty > 0),
              asks: asks.map(([p, q]) => ({ price: Number(p), qty: Number(q) })).filter((l) => l.qty > 0),
            },
          };
        } else if (streamName.includes("@trade")) {
          pendingRef.current = {
            ...pendingRef.current,
            trades: [
              {
                id: Number(data.t),
                price: Number(data.p),
                qty: Number(data.q),
                time: Number(data.T),
                isBuyerMaker: Boolean(data.m),
              },
              ...pendingRef.current.trades,
            ].slice(0, 30),
          };
        } else if (streamName.includes("@ticker")) {
          pendingRef.current = {
            ...pendingRef.current,
            ticker: {
              symbol: String(data.s),
              lastPrice: Number(data.c),
              priceChangePercent: Number(data.P),
              highPrice: Number(data.h),
              lowPrice: Number(data.l),
              volume: Number(data.v),
              quoteVolume: Number(data.q),
            },
          };
        } else {
          return;
        }
        dirtyRef.current = true;
      };
    }

    connect();

    const flushTimer = setInterval(() => {
      if (!dirtyRef.current || cancelled) return;
      dirtyRef.current = false;
      setState(pendingRef.current);
    }, FLUSH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(flushTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [symbol, interval]);

  return state;
}
