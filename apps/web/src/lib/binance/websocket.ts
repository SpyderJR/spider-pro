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

/** Live kline + order book depth + recent trades + rolling 24h ticker, one combined Binance WS connection. */
export function useBinanceStreams(symbol: string, interval: string): StreamState {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    setState(INITIAL_STATE);

    function connect() {
      if (cancelled) return;
      const s = symbol.toLowerCase();
      const streams = [`${s}@kline_${interval}`, `${s}@depth20@100ms`, `${s}@trade`, `${s}@ticker`].join("/");
      ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

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
          setState((prev) => ({
            ...prev,
            kline: {
              time: Math.floor(Number(k.t) / 1000),
              open: Number(k.o),
              high: Number(k.h),
              low: Number(k.l),
              close: Number(k.c),
              volume: Number(k.v),
              isFinal: Boolean(k.x),
            },
          }));
        } else if (streamName.includes("@depth")) {
          const bids = data.bids as [string, string][];
          const asks = data.asks as [string, string][];
          setState((prev) => ({
            ...prev,
            orderBook: {
              bids: bids.map(([p, q]) => ({ price: Number(p), qty: Number(q) })).filter((l) => l.qty > 0),
              asks: asks.map(([p, q]) => ({ price: Number(p), qty: Number(q) })).filter((l) => l.qty > 0),
            },
          }));
        } else if (streamName.includes("@trade")) {
          setState((prev) => ({
            ...prev,
            trades: [
              {
                id: Number(data.t),
                price: Number(data.p),
                qty: Number(data.q),
                time: Number(data.T),
                isBuyerMaker: Boolean(data.m),
              },
              ...prev.trades,
            ].slice(0, 30),
          }));
        } else if (streamName.includes("@ticker")) {
          setState((prev) => ({
            ...prev,
            ticker: {
              symbol: String(data.s),
              lastPrice: Number(data.c),
              priceChangePercent: Number(data.P),
              highPrice: Number(data.h),
              lowPrice: Number(data.l),
              volume: Number(data.v),
              quoteVolume: Number(data.q),
            },
          }));
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [symbol, interval]);

  return state;
}
