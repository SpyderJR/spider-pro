import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { TermifiedText } from "../components/TermifiedText";
import { ExplainButton } from "../components/spider/ExplainButton";
import { CadenaDeBloques } from "../components/academy/diagrams/CadenaDeBloques";
import { DireccionSeudonima } from "../components/onchain/diagrams/DireccionSeudonima";
import { GrafoDeFlujos } from "../components/onchain/diagrams/GrafoDeFlujos";
import { EntidadEtiquetada } from "../components/onchain/diagrams/EntidadEtiquetada";
import { ONCHAIN_TOOLS, type OnchainTool } from "../data/onchainTools";
import { usePublishContext } from "../hooks/usePublishContext";

function ConceptoCard({ icon, title, diagram, children }: { icon: string; title: string; diagram: ReactNode; children: ReactNode }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="bg-void-soft rounded-xl p-3 mb-3">{diagram}</div>
      <div className="text-sm text-slate-300 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function UsoCard({ icon, title, children, to }: { icon: string; title: string; children: ReactNode; to?: string }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <h4 className="text-sm font-bold text-white">{title}</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-2">{children}</p>
      {to && (
        <Link to={to} className="text-[10px] font-mono text-neon-blue hover:underline">
          → Ver en la app
        </Link>
      )}
    </div>
  );
}

const PRICING_LABEL: Record<OnchainTool["pricing"], { text: string; cls: string }> = {
  gratis: { text: "GRATIS", cls: "border-neon-green/40 text-neon-green bg-neon-green/10" },
  freemium: { text: "FREEMIUM", cls: "border-neon-gold/40 text-neon-gold bg-neon-gold/10" },
};

function ToolCard({ tool }: { tool: OnchainTool }) {
  const pricing = PRICING_LABEL[tool.pricing];
  return (
    <div className={`panel p-4 flex flex-col ${tool.featured ? "border-2 border-neon-blue/40" : ""}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg bg-void-soft text-slate-300">{tool.icon}</span>
          <div>
            <div className="text-sm font-bold text-white">{tool.name}</div>
            <div className="text-[10px] font-mono text-slate-500">{tool.chains.join(" · ")}</div>
          </div>
        </div>
        <span className={`shrink-0 text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border ${pricing.cls}`}>{pricing.text}</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-2 flex-1">{tool.description}</p>
      {tool.note && <p className="text-[10px] text-neon-gold/80 leading-relaxed mb-3">⚠ {tool.note}</p>}
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-center px-3 py-1.5 rounded-lg text-xs font-bold border border-void-border text-slate-300 hover:border-neon-blue/50 hover:text-neon-blue transition-colors"
      >
        Abrir ↗
      </a>
    </div>
  );
}

export function OnChainPage() {
  usePublishContext("on-chain", {
    section: "guía educativa de análisis on-chain: qué es, qué se puede ver, sus límites, y directorio de herramientas gratuitas externas",
  });

  const featured = ONCHAIN_TOOLS.filter((t) => t.featured);
  const rest = ONCHAIN_TOOLS.filter((t) => !t.featured);

  return (
    <div>
      <SectionHeader
        title="On-Chain"
        subtitle="El dinero deja huellas: aprende a leerlas. En la blockchain, cada transacción es pública y permanente — el análisis on-chain es leer ese libro abierto."
      />

      <div className="panel border border-neon-blue/30 bg-neon-blue/5 p-5 mb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-blue mb-2">POR QUÉ IMPORTA</div>
        <p className="text-sm text-slate-200 leading-relaxed">
          Esta es una de las pocas ventajas reales que tiene el inversor pequeño: la misma información que ven las
          ballenas, los fondos y las instituciones está disponible gratis para cualquiera, si sabes dónde mirar.
          Nadie tiene acceso a datos privilegiados aquí — solo hay quienes se toman el tiempo de leerlos y quienes no.
        </p>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">¿Qué es el análisis on-chain?</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <ConceptoCard icon="📖" title="La blockchain es pública" diagram={<CadenaDeBloques />}>
          <p>
            Piénsalo como un libro de cuentas gigante que cualquiera puede leer: cada bloque nuevo se encadena al
            anterior, y toda transferencia que ocurrió queda escrita ahí para siempre. No hay páginas privadas ni
            registros que solo ve el banco — <TermifiedText text="cualquiera con una conexión a internet puede consultar cualquier transacción, en cualquier momento." />
          </p>
        </ConceptoCard>

        <ConceptoCard icon="🎭" title="Direcciones: seudónimos, no anónimos" diagram={<DireccionSeudonima />}>
          <p>
            Cada cartera es un código público (una dirección TRON, por ejemplo, empieza con "T"). Ese código no
            lleva tu nombre — pero <strong className="text-white">todo lo que hace es visible y rastreable para siempre</strong>. Es la
            diferencia entre <em>seudónimo</em> (lo que realmente es: una identidad separada de tu nombre) y{" "}
            <em>anónimo</em> (lo que mucha gente cree, equivocadamente, que es).
          </p>
        </ConceptoCard>

        <ConceptoCard icon="🕸" title="El grafo de flujos" diagram={<GrafoDeFlujos />}>
          <p>
            Es la visualización típica de herramientas como Arkham: cada círculo (nodo) es una cartera o entidad, y
            cada línea es una transacción entre ellas. El color indica dirección (verde = entra, rojo = sale) y el
            grosor de la línea indica el tamaño del movimiento. Aprender a leer este tipo de grafo es la habilidad
            central del análisis on-chain.
          </p>
        </ConceptoCard>

        <ConceptoCard icon="🏷" title={'Qué es una "entidad etiquetada"'} diagram={<EntidadEtiquetada />}>
          <p>
            Herramientas como Arkham le ponen <strong className="text-white">nombre</strong> a carteras (Binance,
            Coinbase, un fondo institucional, una ballena conocida) cruzando datos públicos y patrones de
            comportamiento. Eso es lo que convierte un código anónimo en un actor reconocible — es su mayor valor,
            y también lo más difícil de hacer bien, por eso ese trabajo completo suele ser de pago.
          </p>
        </ConceptoCard>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">¿Qué puedes ver on-chain?</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        <UsoCard icon="🐋" title="Movimientos de ballenas">
          Grandes tenedores moviendo fondos entre carteras — a veces anticipan un período de mayor volatilidad, aunque no dicen en qué dirección.
        </UsoCard>
        <UsoCard icon="🔁" title="Flujos hacia/desde exchanges">
          Mucha cripto entrando a un exchange puede indicar intención de vender (presión bajista); saliendo hacia
          carteras frías puede indicar acumulación. Es una señal de contexto, nunca una bola de cristal.
        </UsoCard>
        <UsoCard icon="🏛" title="Actividad institucional">
          Carteras etiquetadas de fondos (como ETFs) acumulando o distribuyendo — información que antes solo se
          conocía meses después, en un reporte trimestral.
        </UsoCard>
        <UsoCard icon="🔍" title="Rastreo de hackeos y estafas">
          Cómo se sigue el dinero robado de cartera en cartera tras un hackeo conocido — la misma transparencia que
          permite ver ballenas también hace muy difícil (aunque no imposible) esconder fondos robados para siempre.
        </UsoCard>
        <UsoCard icon="💵" title="Stablecoins: emisión y quema" to="/app/stablecoins">
          Cuando se emite (mintea) más USDT, suele significar que va a entrar liquidez nueva al mercado; cuando se
          quema, lo contrario. Puedes ver esto en vivo en la pestaña Stablecoins TRON de esta app.
        </UsoCard>
        <UsoCard icon="💓" title="Salud de una red">
          Direcciones activas, cantidad de transacciones, comisiones pagadas — métricas de uso real que no dependen
          del precio ni de lo que se dice en redes sociales.
        </UsoCard>
      </div>

      <div className="panel border-2 border-neon-red/40 p-5 mb-8">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-red mb-3">⚠ LO QUE ON-CHAIN NO PUEDE HACER</div>
        <ul className="space-y-2.5 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-neon-red shrink-0">✕</span>
            <span>
              <strong className="text-white">No revela con certeza la identidad real</strong> detrás de una cartera — las
              etiquetas son estimaciones y atribuciones basadas en patrones, y a veces se equivocan.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-neon-red shrink-0">✕</span>
            <span>
              <strong className="text-white">No predice el futuro.</strong> Que una ballena mueva fondos no garantiza que
              vaya a vender, comprar, ni que el precio vaya a reaccionar de ninguna forma en particular.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-neon-red shrink-0">✕</span>
            <span>
              <strong className="text-white">No es una señal de compra/venta por sí sola</strong> — es contexto que se
              combina con el resto de tu análisis. Revisa{" "}
              <Link to="/app" className="text-neon-blue hover:underline">
                Spider Intelligence
              </Link>{" "}
              y{" "}
              <Link to="/app/gestion-de-riesgo" className="text-neon-blue hover:underline">
                Gestión de Riesgo
              </Link>{" "}
              para ver cómo se combina con otras señales.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-neon-red shrink-0">✕</span>
            <span>
              <strong className="text-white">Cuidado con las cuentas de "alertas de ballenas"</strong> en redes sociales —
              muchas fabrican pánico o FOMO a partir de movimientos que, en contexto, son irrelevantes.
            </span>
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-white mb-1">Directorio de herramientas gratuitas</h2>
      <p className="text-xs text-slate-500 mb-4">
        Enlaces a sitios oficiales de terceros, ajenos a Spider Pro — se abren en una pestaña nueva. Ninguna de estas
        herramientas está integrada a esta app; tú las exploras por tu cuenta.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {featured.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        {rest.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <div className="panel p-5 mb-8">
        <h2 className="text-lg font-bold text-white mb-1">Tu primera investigación on-chain</h2>
        <p className="text-xs text-slate-500 mb-4">Un paso a paso con Tronscan (100% gratis) — la herramienta más cercana a esta plataforma.</p>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">1</span>
            <div>
              <div className="text-sm text-white font-medium">Copia una dirección TRON</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Puedes usar cualquier dirección que veas en esta app, o esta de ejemplo (una billetera real y pública,
                sin que esto implique nada sobre su dueño):{" "}
                <code className="value-mono text-neon-blue bg-void-soft px-1.5 py-0.5 rounded text-[11px]">TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t</code>
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">2</span>
            <div>
              <div className="text-sm text-white font-medium">Pégala en el buscador de Tronscan</div>
              <p className="text-xs text-slate-400 mt-0.5">
                En{" "}
                <a href="https://tronscan.org" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
                  tronscan.org
                </a>
                , pega la dirección en la barra de búsqueda superior y presiona Enter.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">3</span>
            <div>
              <div className="text-sm text-white font-medium">Qué mirar primero</div>
              <p className="text-xs text-slate-400 mt-0.5">El balance actual, la lista de últimas transacciones, y qué tokens tiene esa dirección además de TRX.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">4</span>
            <div>
              <div className="text-sm text-white font-medium">Sigue el dinero</div>
              <p className="text-xs text-slate-400 mt-0.5">Haz clic en cualquier transacción de la lista para ver exactamente de dónde vino y hacia dónde fue — esa es la base de "seguir el rastro".</p>
            </div>
          </li>
        </ol>
        <div className="mt-4 bg-void-soft rounded-lg p-3 text-xs text-slate-300">
          <strong className="text-neon-gold">Ejercicio sugerido:</strong> encuentra una transferencia grande en el historial y
          sigue a dónde fue esa cartera destino — ¿tiene muchas más transacciones? ¿parece un exchange? Esto lo haces
          directo en Tronscan, fuera de esta app.
        </div>
      </div>

      <div className="panel p-5 mb-8">
        <h2 className="text-lg font-bold text-white mb-3">Sigue explorando</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link to="/app/stablecoins" className="block rounded-xl border border-void-border p-3 hover:border-neon-blue/40 transition-colors">
            <div className="text-sm font-bold text-white mb-1">Stablecoins TRON</div>
            <div className="text-xs text-slate-500">Supply y holders en vivo, datos reales de TronScan.</div>
          </Link>
          <Link to="/app" className="block rounded-xl border border-void-border p-3 hover:border-neon-blue/40 transition-colors">
            <div className="text-sm font-bold text-white mb-1">Spider Intelligence</div>
            <div className="text-xs text-slate-500">Cómo se combina el contexto on-chain con el resto de las señales.</div>
          </Link>
          <Link to="/app/academia" className="block rounded-xl border border-void-border p-3 hover:border-neon-blue/40 transition-colors">
            <div className="text-sm font-bold text-white mb-1">Academia — Nivel 9</div>
            <div className="text-xs text-slate-500">On-chain y fundamentos, dentro de la ruta completa de la Academia.</div>
          </Link>
        </div>
        <div className="mt-4">
          <ExplainButton question="¿Qué es el análisis on-chain y cómo lo puedo usar para entender mejor el mercado?" />
        </div>
      </div>

      <Disclaimer text="Contenido educativo. El análisis on-chain es contexto, no asesoría financiera ni una recomendación de compra/venta (NFA). Las herramientas enlazadas son sitios de terceros ajenos a Spider Pro — revisa siempre sus propios términos antes de usarlas." />
    </div>
  );
}
