// Vista previa puramente estática/decorativa — valores fijos, sin fetch ni websockets,
// para mantener la landing rápida. No representa datos de mercado reales.
const CANDLES = [
  { o: 40, h: 52, l: 36, c: 48 },
  { o: 48, h: 58, l: 44, c: 46 },
  { o: 46, h: 50, l: 38, c: 42 },
  { o: 42, h: 54, l: 40, c: 52 },
  { o: 52, h: 66, l: 50, c: 62 },
  { o: 62, h: 68, l: 56, c: 58 },
  { o: 58, h: 62, l: 48, c: 51 },
  { o: 51, h: 60, l: 49, c: 57 },
  { o: 57, h: 72, l: 55, c: 70 },
  { o: 70, h: 78, l: 64, c: 76 },
  { o: 76, h: 80, l: 70, c: 73 },
  { o: 73, h: 77, l: 62, c: 65 },
  { o: 65, h: 74, l: 63, c: 71 },
  { o: 71, h: 86, l: 69, c: 84 },
  { o: 84, h: 90, l: 78, c: 88 },
];

export function DashboardMockPreview() {
  const width = 640;
  const height = 260;
  const candleWidth = width / CANDLES.length;
  const scaleY = (v: number) => height - (v / 100) * height;

  const emaPath = CANDLES.map((c, i) => {
    const x = i * candleWidth + candleWidth / 2;
    const y = scaleY((c.o + c.c) / 2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border border-void-border bg-void-panel shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-void-border bg-void-soft/60">
        <span className="w-2.5 h-2.5 rounded-full bg-neon-red/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-neon-gold/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
        <span className="ml-3 text-[11px] font-mono text-slate-500">app.spiderpro — Terminal</span>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-neon-green text-lg">◈</span>
            <span className="font-mono font-bold text-white text-sm">BTC/USDT</span>
            <span className="text-[11px] font-mono text-neon-green">▲ +2.14%</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600 border border-void-border rounded px-2 py-0.5">
            VISTA PREVIA
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-hidden="true">
          {CANDLES.map((c, i) => {
            const x = i * candleWidth + candleWidth / 2;
            const up = c.c >= c.o;
            const color = up ? "#39ff9c" : "#ff3b5c";
            return (
              <g key={i}>
                <line x1={x} y1={scaleY(c.h)} x2={x} y2={scaleY(c.l)} stroke={color} strokeWidth={1.5} opacity={0.8} />
                <rect
                  x={x - candleWidth * 0.28}
                  y={scaleY(Math.max(c.o, c.c))}
                  width={candleWidth * 0.56}
                  height={Math.max(2, Math.abs(scaleY(c.o) - scaleY(c.c)))}
                  fill={color}
                  opacity={0.85}
                  rx={1}
                />
              </g>
            );
          })}
          <path d={emaPath} fill="none" stroke="#3ba8ff" strokeWidth={2} opacity={0.6} />
        </svg>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {["Fear & Greed", "Spider Score", "Distancia al ATH"].map((label, i) => (
            <div key={label} className="bg-void-soft rounded-lg px-3 py-2">
              <div className="text-[9px] font-mono text-slate-500 mb-0.5">{label.toUpperCase()}</div>
              <div className={`value-mono text-sm font-bold ${i === 1 ? "text-neon-gold" : "text-neon-green"}`}>
                {i === 0 ? "42" : i === 1 ? "58" : "-31%"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
