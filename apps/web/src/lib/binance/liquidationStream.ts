/**
 * Binance Futures publica cada liquidación forzosa real en vivo — no una estimación, una orden
 * que YA se ejecutó (`!forceOrder@arr`, stream global de todo el mercado). Es un host distinto
 * (`fstream.binance.com`, futuros) al que usa `useBinanceStreams` (spot, `stream.binance.com`),
 * así que es una conexión independiente, no una extensión de ese hook.
 */
const LIQUIDATION_WS_URL = "wss://fstream.binance.com/ws/!forceOrder@arr";

export interface LiquidationEvent {
  id: string;
  symbol: string;
  /** Lado de la posición que se liquidó — no el lado de la orden que la cerró. */
  side: "long" | "short";
  price: number;
  quantity: number;
  quoteValue: number;
  time: number;
}

interface RawForceOrder {
  o: {
    s: string;
    S: "BUY" | "SELL";
    q: string;
    p: string;
    ap: string;
    T: number;
  };
}

function parseForceOrderEvent(raw: RawForceOrder): LiquidationEvent {
  const o = raw.o;
  const price = Number(o.ap) || Number(o.p);
  const quantity = Number(o.q);
  return {
    id: `${o.s}-${o.T}-${o.q}`,
    symbol: o.s,
    // Una orden SELL cierra una posición LONG (el long fue liquidado); BUY cierra un SHORT.
    side: o.S === "SELL" ? "long" : "short",
    price,
    quantity,
    quoteValue: price * quantity,
    time: o.T,
  };
}

/** Conecta al feed global de liquidaciones. Devuelve una función de limpieza — llamarla en el
 * cleanup de useEffect cierra el socket y cancela cualquier reintento pendiente. */
export function connectLiquidationStream(
  onEvent: (event: LiquidationEvent) => void,
  onStatusChange: (connected: boolean) => void,
): () => void {
  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;

  function connect() {
    if (cancelled) return;
    ws = new WebSocket(LIQUIDATION_WS_URL);

    ws.onopen = () => {
      if (!cancelled) onStatusChange(true);
    };

    ws.onclose = () => {
      if (cancelled) return;
      onStatusChange(false);
      reconnectTimer = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      ws?.close();
    };

    ws.onmessage = (event) => {
      if (cancelled) return;
      try {
        const raw = JSON.parse(event.data) as RawForceOrder;
        if (!raw?.o) return;
        onEvent(parseForceOrderEvent(raw));
      } catch {
        // Mensaje malformado — se descarta, no interrumpe la conexión.
      }
    };
  }

  connect();

  return () => {
    cancelled = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
  };
}
