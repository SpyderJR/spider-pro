import type { ReactNode } from "react";
import { ComboADiagram } from "../../components/fractals/diagrams/ComboADiagram";
import { ComboBDiagram } from "../../components/fractals/diagrams/ComboBDiagram";
import { ComboCDiagram } from "../../components/fractals/diagrams/ComboCDiagram";

const INDICATORS = ["Fractales", "Alligator", "ZigZag", "Pivots", "%R + AO", "Estructura"] as const;

type Verdict = "good" | "redundant" | "bad";

const VERDICT_STYLE: Record<Verdict, { symbol: string; cls: string }> = {
  good: { symbol: "✔", cls: "text-neon-green bg-neon-green/10" },
  redundant: { symbol: "~", cls: "text-neon-gold bg-neon-gold/10" },
  bad: { symbol: "✖", cls: "text-neon-red bg-neon-red/10" },
};

// Upper-triangular matrix — matrix[i][j] for j > i. Diagonal and lower triangle are mirrored/blank in render.
const MATRIX: Record<string, { verdict: Verdict; note: string }> = {
  "Fractales|Alligator": { verdict: "good", note: "combo clásico: contexto + señal exacta." },
  "Fractales|ZigZag": { verdict: "redundant", note: "ambos marcan giros — el ZigZag solo sirve de referencia visual." },
  "Fractales|Pivots": { verdict: "good", note: "confluencia de dos métodos de nivel independientes." },
  "Fractales|%R + AO": { verdict: "good", note: "señal + confirmación de fuerza detrás." },
  "Fractales|Estructura": { verdict: "redundant", note: "misma base técnica — no sumar como si fueran 2 señales independientes." },
  "Alligator|ZigZag": { verdict: "redundant", note: "ambos leen tendencia/dirección — aporte extra bajo." },
  "Alligator|Pivots": { verdict: "good", note: "contexto de tendencia + nivel prospectivo." },
  "Alligator|%R + AO": { verdict: "good", note: "sistema diseñado por el mismo autor para trabajar junto." },
  "Alligator|Estructura": { verdict: "redundant", note: "ambos son 'contexto' — misma capa, redundantes entre sí." },
  "ZigZag|Pivots": { verdict: "good", note: "visualización de swings + nivel matemático, se complementan." },
  "ZigZag|%R + AO": { verdict: "bad", note: "sin sinergia real: el ZigZag no da entradas que un oscilador deba confirmar." },
  "ZigZag|Estructura": { verdict: "good", note: "el ZigZag visualiza exactamente los swings que definen la estructura." },
  "Pivots|%R + AO": { verdict: "good", note: "nivel conocido + confirmación de agotamiento (Combo B)." },
  "Pivots|Estructura": { verdict: "good", note: "un nivel de pivot conocido valida la importancia de un BOS/CHoCH." },
  "%R + AO|Estructura": { verdict: "good", note: "confirma la fuerza real detrás de una ruptura de estructura." },
};

function lookup(a: string, b: string) {
  return MATRIX[`${a}|${b}`] ?? MATRIX[`${b}|${a}`] ?? null;
}

export function CombosSection() {
  return (
    <section id="combinaciones" className="scroll-mt-24 mb-10">
      <div className="panel p-6 mb-6 relative overflow-hidden border border-neon-gold/20">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-neon-gold/10 blur-3xl rounded-full" />
        <h2 className="text-2xl font-bold text-white mb-2 relative">El sistema completo: cómo combinarlos</h2>
        <p className="text-sm text-slate-400 relative max-w-3xl">
          Tan importante como entender cada indicador por separado es saber que{" "}
          <strong className="text-white">ninguno se usa solo</strong>. Esta sección es la guía de ensamblaje.
        </p>
      </div>

      {/* 1. Principio de las 3 capas */}
      <div className="panel p-5 mb-6">
        <div className="text-[11px] font-mono text-neon-blue tracking-widest mb-3">EL PRINCIPIO DE LAS 3 CAPAS</div>
        <p className="text-sm text-slate-300 mb-4">
          Una combinación correcta cubre <strong className="text-white">3 roles distintos</strong> — nunca
          apila varios indicadores que miden lo mismo.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-void-soft rounded-lg p-4 border border-void-border">
            <div className="text-xs font-mono text-neon-blue mb-1.5">CONTEXTO</div>
            <p className="text-xs text-slate-500 mb-2">¿Hay tendencia o rango?</p>
            <p className="text-sm text-slate-300">Alligator · Estructura (HH/HL/LH/LL)</p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border">
            <div className="text-xs font-mono text-neon-gold mb-1.5">SEÑAL / NIVEL</div>
            <p className="text-xs text-slate-500 mb-2">¿Dónde entrar?</p>
            <p className="text-sm text-slate-300">Fractales · Pivot Points · BOS/CHoCH</p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border">
            <div className="text-xs font-mono text-neon-green mb-1.5">CONFIRMACIÓN</div>
            <p className="text-xs text-slate-500 mb-2">¿Hay fuerza detrás?</p>
            <p className="text-sm text-slate-300">Awesome Oscillator · Williams %R</p>
          </div>
        </div>
      </div>

      {/* 2. Tres combos */}
      <div className="space-y-6 mb-6">
        <ComboCard
          title="Combo A — El sistema Bill Williams original"
          subtitle="Alligator + Fractales + Awesome Oscillator"
          diagram={<ComboADiagram />}
          steps={[
            "El Alligator despierta y abre la boca hacia arriba — contexto de tendencia alcista confirmado.",
            "Aparece un fractal alcista por encima de los Dientes del Alligator.",
            "El precio rompe ese fractal al alza — señal de entrada.",
            "El AO está verde y por encima de cero — confirmación de momentum. Stop loss debajo del último fractal bajista.",
          ]}
          footer="Es la estrategia tal como Bill Williams la diseñó originalmente en 'Trading Chaos' — el combo de referencia del que se derivan casi todos los demás."
        />
        <ComboCard
          title="Combo B — Confluencia de niveles"
          subtitle="Pivot Points + Fractales + Williams %R"
          diagram={<ComboBDiagram />}
          steps={[
            "El precio cae hacia S1 diario — un nivel conocido de antemano, calculado antes de la sesión.",
            "Se forma un fractal alcista justo sobre S1 — dos métodos independientes coinciden en el mismo nivel.",
            "Williams %R sale de sobreventa cruzando por encima de −80 — confirmación de agotamiento vendedor.",
            "Entrada con stop debajo de S2.",
          ]}
          footer="La confluencia de métodos independientes (uno prospectivo, uno reactivo, uno de momentum) vale más que cualquier indicador solo — cada uno pudo haber fallado por separado, pero los 3 coincidiendo reduce drásticamente el ruido."
        />
        <ComboCard
          title="Combo C — Estructura moderna"
          subtitle="BOS/CHoCH + Fractales + ZigZag"
          diagram={<ComboCDiagram />}
          steps={[
            "El ZigZag limpia el ruido y muestra los swings mayores — contexto visual únicamente.",
            "Esos swings son, técnicamente, fractales ya confirmados.",
            "Un CHoCH avisa de un posible giro de estructura.",
            "El primer BOS en la nueva dirección confirma el cambio — entrada en el retroceso al último fractal.",
          ]}
          footer="El ZigZag acá es solo herramienta de visualización, nunca de entrada — la señal real la dan el fractal confirmado y el BOS."
        />
      </div>

      {/* 3. Matriz de compatibilidad */}
      <div className="panel p-5 mb-6">
        <div className="text-[11px] font-mono text-neon-blue tracking-widest mb-4">MATRIZ DE COMPATIBILIDAD</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[560px]">
            <thead>
              <tr>
                <th className="p-2"></th>
                {INDICATORS.map((label) => (
                  <th key={label} className="p-2 text-slate-400 font-mono font-normal text-center whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INDICATORS.map((row) => (
                <tr key={row}>
                  <td className="p-2 text-slate-400 font-mono whitespace-nowrap">{row}</td>
                  {INDICATORS.map((col) => {
                    if (row === col) {
                      return <td key={col} className="p-2 text-center text-slate-700">·</td>;
                    }
                    const cell = lookup(row, col);
                    if (!cell) return <td key={col} className="p-2 text-center text-slate-700">·</td>;
                    const style = VERDICT_STYLE[cell.verdict];
                    return (
                      <td key={col} className="p-1.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded ${style.cls} font-bold cursor-help`}
                          title={cell.note}
                        >
                          {style.symbol}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1.5 text-neon-green">✔ combinan muy bien (roles complementarios)</span>
          <span className="flex items-center gap-1.5 text-neon-gold">~ redundantes (miden lo mismo)</span>
          <span className="flex items-center gap-1.5 text-neon-red">✖ sin sinergia real</span>
        </div>
        <p className="text-xs text-slate-600 mt-2">Pasá el mouse sobre cada símbolo para ver el porqué.</p>
      </div>

      {/* 4. Anti-patrón */}
      <div className="bg-neon-red/5 border border-neon-red/30 rounded-xl p-5">
        <div className="text-[11px] font-mono text-neon-red tracking-widest mb-2">⚠ ANTI-PATRÓN</div>
        <p className="text-sm text-slate-300 mb-2">
          Apilar 5 o más indicadores del mismo tipo <strong className="text-white">no da más certeza — da
          parálisis por análisis</strong>. Cinco osciladores de momentum diciendo lo mismo no son 5
          confirmaciones independientes, son la misma información repetida 5 veces con nombres distintos.
        </p>
        <p className="text-sm text-slate-300">
          <strong className="text-white">La regla:</strong> máximo un indicador por capa (contexto + señal +
          confirmación), y saber exactamente qué pregunta responde cada uno antes de agregarlo al gráfico.
        </p>
      </div>
    </section>
  );
}

function ComboCard({
  title,
  subtitle,
  diagram,
  steps,
  footer,
}: {
  title: string;
  subtitle: string;
  diagram: ReactNode;
  steps: string[];
  footer: string;
}) {
  return (
    <div className="panel p-5 border border-neon-gold/15">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs font-mono text-neon-gold">{subtitle}</p>
      </div>
      <div className="bg-void-soft rounded-lg p-4 border border-void-border mb-4">{diagram}</div>
      <ol className="space-y-2 mb-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-300">
            <span className="shrink-0 w-5 h-5 rounded-full bg-neon-gold/15 text-neon-gold text-xs font-bold flex items-center justify-center font-mono">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-slate-500 italic border-t border-void-border pt-3">{footer}</p>
    </div>
  );
}
