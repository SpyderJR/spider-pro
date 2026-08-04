export function SurvivalRules() {
  return (
    <section id="reglas-supervivencia" className="scroll-mt-24 mb-10">
      <div className="panel p-5">
        <div className="font-semibold text-white mb-3">Reglas de supervivencia</div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <div className="text-neon-green font-mono text-xs mb-2">HAZ ESTO SIEMPRE</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Define el stop loss antes de entrar, nunca después</li>
              <li>Arriesga como máximo 1-2% de la cuenta por trade</li>
              <li>Calcula el tamaño de posición a partir del stop, no al revés</li>
              <li>Busca ratios riesgo/beneficio de al menos 1:1.5</li>
              <li>Registra cada trade en el Diario, ganador o perdedor</li>
              <li>Espera tu propia lista de condiciones antes de entrar</li>
            </ul>
          </div>
          <div>
            <div className="text-neon-red font-mono text-xs mb-2">SEÑALES DE QUE ALGO ANDA MAL</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Aumentaste el tamaño de posición después de una racha ganadora</li>
              <li>Moviste un stop loss en contra tuyo para "darle espacio"</li>
              <li>Abriste un trade minutos después de cerrar uno en pérdida</li>
              <li>No puedes explicar por qué entraste sin mencionar el precio ya movido</li>
              <li>Estás revisando el gráfico más de lo que revisas tu plan</li>
              <li>Un solo trade te haría perder más del 5% de la cuenta</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
