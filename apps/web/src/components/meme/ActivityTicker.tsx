import type { MemeActivityEvent } from "@spider/types";
import { IdenticonAvatar } from "./IdenticonAvatar";

interface Props {
  events: MemeActivityEvent[] | null;
  onSelect: (address: string) => void;
}

function Pill({ event, onSelect }: { event: MemeActivityEvent; onSelect: (address: string) => void }) {
  const isBuy = event.type === "buy";
  return (
    <button
      onClick={() => onSelect(event.tokenAddress)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0 whitespace-nowrap transition-colors ${
        isBuy ? "border-neon-green/30 hover:bg-neon-green/10" : "border-neon-red/30 hover:bg-neon-red/10"
      }`}
    >
      {event.imageUrl ? (
        <img src={event.imageUrl} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
      ) : (
        <IdenticonAvatar seed={event.tokenAddress} size={16} />
      )}
      <span className={`text-[10px] font-mono font-bold ${isBuy ? "text-neon-green" : "text-neon-red"}`}>
        {isBuy ? "▲ COMPRA" : "▼ VENTA"}
      </span>
      <span className="text-[10px] font-mono text-white">${event.symbol ?? "?"}</span>
      {event.trxAmount !== null && (
        <span className="text-[10px] font-mono text-slate-400">
          {event.trxAmount.toLocaleString("es-MX", { maximumFractionDigits: 2 })} TRX
        </span>
      )}
    </button>
  );
}

export function ActivityTicker({ events, onSelect }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="border-y border-void-border bg-void-soft/60 py-2 px-4 text-[10px] font-mono text-slate-600">
        Esperando actividad en vivo de SunPump...
      </div>
    );
  }

  return (
    <div className="border-y border-void-border bg-void-soft/60 overflow-hidden">
      <div className="flex items-center gap-2 py-2 animate-marquee w-max">
        {[...events, ...events].map((e, i) => (
          <Pill key={`${e.txId}-${i}`} event={e} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
