import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { ConceptCard } from "../components/contracts/ConceptCard";
import { LiquidationSimulator } from "../components/contracts/LiquidationSimulator";
import { LeverageZonesPanel } from "../components/contracts/LeverageZonesPanel";
import {
  AppleIcon,
  HandshakeBetIcon,
  ElevatorIcon,
  LeverIcon,
  SkatesIcon,
  LavaFloorIcon,
  ClockRentIcon,
  ScaleIcon,
  SeismographIcon,
} from "../components/contracts/icons";
import { usePublishContext } from "../hooks/usePublishContext";

const LEVERAGE_TABLE = [1, 5, 10, 25, 50, 100];

export function ContratosPage() {
  usePublishContext("contratos", {
    section: "guía educativa de futuros, apalancamiento, margen y liquidación — enseñada con el riesgo al frente",
  });

  return (
    <div>
      <SectionHeader
        title="Contratos"
        subtitle="Futuros y apalancamiento explicados con el riesgo primero. Nada de esto es una invitación a usarlos — es para que entiendas exactamente qué arriesgas si algún día decides hacerlo."
      />

      <div className="panel border border-neon-red/30 bg-neon-red/5 p-5 mb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-red mb-2">ANTES DE EMPEZAR</div>
        <p className="text-slate-200 text-sm leading-relaxed">
          El apalancamiento no es una forma de "ganar más rápido". Es dinero prestado que amplifica cada movimiento
          del precio en <strong>ambas direcciones</strong> — y la gran mayoría de las cuentas apalancadas de
          principiantes terminan liquidadas, no por mala suerte, sino por no entender exactamente lo que están
          arriesgando. Lee esta página completa antes de tocar cualquier botón de apalancamiento en la Terminal.
        </p>
      </div>

      <LiquidationSimulator />

      <LeverageZonesPanel />

      <ConceptCard
        icon="🍎"
        title="Spot vs Contratos"
        kidIllustration={
          <div className="grid grid-cols-2 gap-2">
            <AppleIcon />
            <HandshakeBetIcon />
          </div>
        }
        kidText='Spot = comprar la manzana y llevártela a casa. Contrato = apostar con tu amigo sobre el precio que va a tener la manzana mañana, sin comprarla.'
        seriousContent={
          <>
            <p>
              En <strong>Spot</strong> compras el activo real: el BTC entra a tu wallet, eres dueño de algo. En{" "}
              <strong>futuros</strong> nunca posees el activo — tienes una posición sobre su precio futuro.
            </p>
            <p>
              Por eso en futuros puedes apostar tanto a que el precio sube como a que baja, sin necesitar tener el
              BTC primero. En spot, la única forma de ganar es que el precio suba después de que compraste.
            </p>
          </>
        }
        numbersContent={
          <>
            <p className="mb-2">
              <strong className="text-slate-200">Spot:</strong> compras 0.01 BTC a $63,000 → pagas $630 y el BTC es
              tuyo.
            </p>
            <p>
              <strong className="text-slate-200">Contrato:</strong> abres un long de 0.01 BTC a $63,000 → no pagas
              $630, solo dejas un margen (ej. $63 a 10x) y ganas o pierdes según hacia dónde se mueva el precio.
            </p>
          </>
        }
      />

      <ConceptCard
        icon="📈"
        title="Long y Short"
        kidIllustration={<ElevatorIcon />}
        kidText="Long es apostar que el ascensor sube. Short es apostar que baja."
        seriousContent={
          <>
            <p>
              En un <strong>long</strong> ganas si el precio sube — igual que en spot. En un <strong>short</strong>{" "}
              ganas si el precio <strong>baja</strong>, algo que en spot es imposible (a lo sumo evitas perder si no
              vendes).
            </p>
            <p>El short es la herramienta que hace posible "vender algo que no tienes" para comprarlo más barato después y quedarte con la diferencia.</p>
          </>
        }
        numbersContent={
          <>
            <p className="mb-2">
              <strong className="text-neon-green">Long:</strong> entras a $63,000, el precio sube a $65,000 → ganas
              $2,000 por cada BTC de exposición.
            </p>
            <p>
              <strong className="text-neon-red">Short:</strong> entras a $63,000, el precio cae a $60,000 → ganas
              $3,000 por cada BTC de exposición.
            </p>
          </>
        }
      />

      <ConceptCard
        icon="⚖️"
        title="Apalancamiento"
        kidIllustration={<LeverIcon />}
        kidText="Es la palanca que multiplica tu fuerza 10 veces… y también multiplica 10 veces el golpe si te resbala."
        seriousContent={
          <>
            <p>
              Apalancarte es operar con dinero prestado por el exchange. <strong>10x</strong> significa que con $100
              propios mueves $1,000 de exposición real.
            </p>
            <p>
              La consecuencia: un movimiento del precio de apenas 1% se convierte en un 10% de efecto sobre tu
              dinero — para bien <strong>y</strong> para mal, simétricamente.
            </p>
          </>
        }
        numbersContent={
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-void-border">
                  <th className="py-1.5 pr-2">Apalanc.</th>
                  <th className="py-1.5 text-right">Efecto de un +1% en el precio</th>
                </tr>
              </thead>
              <tbody>
                {LEVERAGE_TABLE.map((lev) => (
                  <tr key={lev} className="border-b border-void-border/50 last:border-0">
                    <td className="py-1.5 pr-2 value-mono text-slate-200">{lev}x</td>
                    <td className="py-1.5 text-right value-mono text-neon-green">+{lev}% en tu cuenta</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-slate-500 mt-2">
              La misma tabla aplica en espejo si el precio se mueve -1%: pierdes ese mismo % de tu cuenta.
            </p>
          </div>
        }
      />

      <ConceptCard
        icon="⛸"
        title="Margen"
        kidIllustration={<SkatesIcon />}
        kidText="Es el depósito que dejas cuando alquilas patines — si los rompes, se lo quedan."
        seriousContent={
          <>
            <p>
              El margen es el colateral que respalda tu posición. <strong>Aislado</strong>: solo arriesgas el
              margen que asignaste a esa posición puntual — si se liquida, el resto de tu cuenta está a salvo.
            </p>
            <p>
              <strong>Cruzado</strong>: toda tu cuenta respalda todas tus posiciones abiertas — reduce el riesgo de
              liquidación de una posición individual, pero expone todo tu balance si algo sale mal.
            </p>
            <p className="text-neon-gold">Recomendación mientras aprendes: usa siempre margen aislado.</p>
          </>
        }
        numbersContent={
          <p>
            Cuenta de $1,000. Abres una posición con $100 de margen <strong>aislado</strong> a 10x ($1,000 de
            exposición). Si te liquidan, pierdes esos $100 — los otros $900 siguen intactos. Con margen{" "}
            <strong>cruzado</strong>, esa misma pérdida se cubre con el balance total de tu cuenta.
          </p>
        }
      />

      <ConceptCard
        large
        icon="🌋"
        title="Liquidación"
        kidIllustration={<LavaFloorIcon leverageLabel="a más apalancamiento, la lava sube" />}
        kidText="Es el juego de 'el piso es lava': con poca palanca la lava está lejos de tus pies; con mucha, sube hasta casi tocarte — y cualquier salpicadura te quema TODO el depósito."
        seriousContent={
          <>
            <p>
              Si el precio toca tu <strong>precio de liquidación</strong>, el exchange cierra tu posición a la
              fuerza y pierdes el margen completo de esa posición. No es "esperar a que rebote" — la posición ya no
              existe, el dinero ya no está.
            </p>
            <p>
              Cuanto mayor el apalancamiento, más cerca está tu liquidación del precio de entrada — y más fácil es
              que la toque el ruido normal del mercado, sin que tu análisis haya estado equivocado.
            </p>
          </>
        }
        numbersContent={
          <div className="space-y-1.5">
            <p className="text-[11px] text-slate-500 mb-2">
              Entrada long en $63,000 (aproximado, asumiendo margen de mantenimiento ~0.5% — varía por exchange):
            </p>
            <div className="flex justify-between">
              <span className="text-slate-400">10x</span>
              <span className="value-mono text-neon-red">≈ $57,015 (-9.5%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">50x</span>
              <span className="value-mono text-neon-red">≈ $62,055 (-1.5%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">100x</span>
              <span className="value-mono text-neon-red">≈ $62,685 (-0.5%)</span>
            </div>
            <p className="text-[11px] text-neon-red mt-2">
              A 100x, el ruido normal de una hora de BTC te liquida.
            </p>
          </div>
        }
      />

      <ConceptCard
        icon="⏰"
        title="Funding rate"
        kidIllustration={<ClockRentIcon />}
        kidText="Es la renta que pagas (o cobras) cada 8 horas por mantener la apuesta abierta."
        seriousContent={
          <>
            <p>
              Los contratos perpetuos no tienen vencimiento, así que usan un pago periódico entre longs y shorts
              (el <strong>funding rate</strong>) para mantener el precio del contrato anclado al precio spot real.
            </p>
            <p>Si tu lado (long o short) es el mayoritario, generalmente pagas; si eres el minoritario, generalmente cobras. Mantener una posición apalancada abierta mucho tiempo tiene un costo continuo.</p>
          </>
        }
        numbersContent={
          <p>
            Ejemplo ilustrativo: con una tasa de 0.01% cada 8h (típica en BTC en mercados calmos) sobre una
            posición de $10,000 de exposición, pagas/cobras $1 cada 8 horas — unos $3 por día, ~$90 al mes si
            mantienes la posición sin cerrarla. La tasa real cambia constantemente según el mercado.
          </p>
        }
      />

      <ConceptCard
        icon="🧮"
        title="Tamaño de posición con apalancamiento"
        kidIllustration={<ScaleIcon />}
        kidText="El apalancamiento no debería cambiar cuánto te la juegas — solo cuánto depósito necesitas dejar."
        seriousContent={
          <>
            <p>
              El error mental número 1: pensar que "más apalancamiento = arriesgo más". La regla profesional es al
              revés: primero decides cuánto vas a arriesgar (ej. 1% de tu cuenta según tu stop loss), y recién
              después el apalancamiento determina cuánto margen necesitas bloquear para esa exposición — no cambia
              cuánto pierdes si el SL se ejecuta.
            </p>
          </>
        }
        numbersContent={
          <>
            <p className="mb-2">
              Cuenta de $10,000, riesgo 1% = <strong>$100</strong>. Entras long BTC en $63,000 con SL en $61,740
              (2% de distancia).
            </p>
            <p className="mb-2">
              Tamaño de posición correcto = $100 / 2% = <strong>$5,000</strong> de exposición (~0.079 BTC) — sin
              importar el apalancamiento.
            </p>
            <p>
              A 10x, el margen bloqueado es $500. A 25x, es $200. En ambos casos sigues arriesgando los mismos $100
              si tu SL se ejecuta — el apalancamiento solo cambió el margen, no el riesgo real.
            </p>
          </>
        }
      />

      <ConceptCard
        icon="📏"
        title="Stop Loss profesional: con ATR, no a ojo"
        kidIllustration={<SeismographIcon />}
        kidText="Un cinturón de seguridad de talla fija aprieta demasiado en un camino tranquilo y afloja demasiado en uno lleno de baches. El stop con ATR se ajusta solo según qué tan movido está el mercado ahora mismo."
        seriousContent={
          <>
            <p>
              El error más común al colocar un Stop Loss es usar el mismo % fijo (ej. "siempre 2%") sin importar si el
              activo está tranquilo o extremadamente volátil ese día. Un stop calculado con{" "}
              <Link to="/app/analisis-tecnico" className="text-neon-blue underline">
                ATR (Average True Range)
              </Link>{" "}
              en cambio se coloca a un múltiplo de la volatilidad real reciente — se ensancha solo cuando el mercado
              se mueve más, y se ajusta solo cuando se calma.
            </p>
            <p>
              El Take Profit se puede calcular con la misma lógica: definiendo primero un ratio riesgo/beneficio (ej.
              1:2) sobre la distancia de ATR, en vez de un número redondo elegido sin relación con la volatilidad
              real del activo.
            </p>
          </>
        }
        numbersContent={
          <>
            <p className="mb-2">
              BTC en 1h con ATR(14) = $600. Un stop de <strong className="text-white">1.5× ATR</strong> = $900 de
              distancia del precio de entrada — se calcula solo, sin adivinar un %.
            </p>
            <p className="mb-2">
              Si al día siguiente la volatilidad sube y el ATR pasa a $1,100, el mismo múltiplo produce un stop de
              $1,650: se adapta automáticamente en vez de que el ruido de un día más movido lo saque de la operación
              sin que la idea original haya estado mal.
            </p>
            <p>
              Puedes probar esta lógica exacta en el{" "}
              <Link to="/app/backtester" className="text-neon-blue underline">
                Backtester
              </Link>{" "}
              (modo de Stop Loss "ATR") y en el panel de Futuros de la Terminal, que sugiere un SL con ATR con un
              botón.
            </p>
          </>
        }
      />

      <div className="panel p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">La realidad, sin filtro</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Múltiples estudios de exchanges y reguladores muestran que la gran mayoría de las cuentas minoristas que
          operan contratos apalancados pierden dinero en el agregado — y las pérdidas se concentran fuertemente en
          apalancamientos altos usados sin stop loss ni plan de salida.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Los traders profesionales que sí usan futuros suelen operar con apalancamientos bajos (2x-5x) y siempre
          con stop loss definido de antemano. El apalancamiento alto (50x, 100x) no es una herramienta de trading —
          es la mecánica de un casino con gráficos de velas.
        </p>
      </div>

      <Disclaimer text="Los contratos con apalancamiento son instrumentos de alto riesgo con los que puedes perder la totalidad de tu margen, incluso teniendo razón sobre la dirección del mercado. Contenido educativo, no asesoría financiera (NFA)." />
      <Link to="/riesgo" target="_blank" className="text-[11px] font-mono text-neon-blue hover:underline">
        → Leer el Aviso de Riesgo completo
      </Link>
    </div>
  );
}
