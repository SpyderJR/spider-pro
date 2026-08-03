const ROWS = [
  {
    name: "Fractales",
    measures: "Máximos/mínimos locales de 5 velas",
    timeframe: "4h — Diario",
    signalType: "Nivel + confirmación de giro (rezagada 2 velas)",
    combines: "Alligator, Pivots, %R + AO",
  },
  {
    name: "Alligator",
    measures: "Orden y separación de 3 medias suavizadas",
    timeframe: "Cualquiera (filtro)",
    signalType: "Contexto de tendencia — nunca entrada directa",
    combines: "Fractales, AO",
  },
  {
    name: "ZigZag",
    measures: "Giros mayores filtrados por % de movimiento",
    timeframe: "Retrospectivo / educativo",
    signalType: "Visualización — repinta el último tramo",
    combines: "Pivots, Estructura",
  },
  {
    name: "Pivot Points",
    measures: "Niveles matemáticos del período anterior",
    timeframe: "Diario (intradía) — Semanal (swing)",
    signalType: "Nivel prospectivo, conocido antes de la sesión",
    combines: "Fractales, %R + AO",
  },
  {
    name: "Williams %R + AO",
    measures: "Posición del cierre en el rango + momentum 5 vs 34",
    timeframe: "Cualquiera (confirmación)",
    signalType: "Confirmación de fuerza — nunca señal primaria",
    combines: "Fractales, Alligator, Pivots",
  },
  {
    name: "Estructura (BOS/CHoCH)",
    measures: "Secuencia de HH/HL/LH/LL",
    timeframe: "4h/Diario (contexto) — 15m/1h (entrada)",
    signalType: "Contexto + señal de cambio de tendencia",
    combines: "Fractales, ZigZag",
  },
];

export function ComparisonTable() {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4">Tabla comparativa</h2>
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-void-border bg-void-soft/50">
                <th className="py-2.5 px-4">Indicador</th>
                <th className="py-2.5 px-4">Qué mide</th>
                <th className="py-2.5 px-4">Mejor temporalidad</th>
                <th className="py-2.5 px-4">Tipo de señal</th>
                <th className="py-2.5 px-4">Se combina bien con</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name} className="border-b border-void-border/50 last:border-0">
                  <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">{r.name}</td>
                  <td className="py-3 px-4 text-slate-400">{r.measures}</td>
                  <td className="py-3 px-4 text-slate-400 value-mono text-xs whitespace-nowrap">{r.timeframe}</td>
                  <td className="py-3 px-4 text-slate-400">{r.signalType}</td>
                  <td className="py-3 px-4 text-neon-blue text-xs">{r.combines}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
