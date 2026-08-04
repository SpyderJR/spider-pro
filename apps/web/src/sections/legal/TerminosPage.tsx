import { LegalPageLayout, LegalSection } from "../../components/legal/LegalPageLayout";

export function TerminosPage() {
  return (
    <LegalPageLayout title="Términos y Condiciones">
      <LegalSection
        title="1. Qué es Spider Pro"
        summary="Una plataforma educativa gratuita de simulación de trading. No es un exchange ni un bróker."
      >
        <p>
          Spider Pro es una plataforma educativa gratuita orientada a enseñar conceptos de trading de
          criptomonedas mediante simuladores, juegos, contenido de academia y herramientas de análisis. No
          somos un exchange, un bróker, un asesor financiero registrado ni una casa de bolsa. No custodiamos
          fondos reales de ningún usuario en ningún momento.
        </p>
      </LegalSection>

      <LegalSection
        title="2. Todo el trading es simulado"
        summary="Nunca operas con dinero real aquí. Nada de lo que ves es asesoría financiera."
      >
        <p>
          Toda la actividad de "trading" dentro de Spider Pro (Terminal, Arcade, simuladores, calculadoras)
          usa dinero ficticio y datos de mercado con fines exclusivamente educativos. Ningún contenido de la
          plataforma —incluyendo textos, señales visuales, feedback automático, el Spider Score o las
          respuestas del chat— constituye asesoría financiera, de inversión, legal ni fiscal, ni una
          recomendación de compra o venta de ningún activo. NFA: Not Financial Advice.
        </p>
      </LegalSection>

      <LegalSection
        title="3. Datos de mercado de terceros"
        summary="Los precios y datos vienen de proveedores externos (Binance, alternative.me, FRED, CoinGecko) sin garantía de exactitud."
      >
        <p>
          Los datos de mercado que se muestran (precios, velas, indicadores, sentimiento, funding rate,
          oferta monetaria) provienen de APIs públicas de terceros — Binance, alternative.me, FRED (Reserva
          Federal de EE. UU.) y CoinGecko, entre otros. No garantizamos su exactitud, disponibilidad continua
          ni ausencia de errores o interrupciones. Estos proveedores pueden cambiar o discontinuar sus
          servicios sin que dependa de nosotros.
        </p>
      </LegalSection>

      <LegalSection
        title="4. Uso aceptable"
        summary="No abuses del servicio ni intentes evadir límites técnicos."
      >
        <p>
          No está permitido intentar comprometer la seguridad de la plataforma, abusar de las funciones
          gratuitas (por ejemplo, evadir los límites diarios del chat con AI mediante múltiples cuentas o
          medios automatizados), ni usar el servicio con fines distintos al educativo para el que fue
          diseñado.
        </p>
      </LegalSection>

      <LegalSection
        title="5. Edad mínima"
        summary="Tienes que tener al menos 18 años para usar Spider Pro."
      >
        <p>
          Por la naturaleza del contenido (trading, apalancamiento, riesgo financiero), el uso de esta
          plataforma está restringido a personas mayores de 18 años.
        </p>
      </LegalSection>

      <LegalSection
        title={'6. El servicio se ofrece "tal cual"'}
        summary="No hay garantías. Tú eres el único responsable de tus decisiones financieras reales."
      >
        <p>
          Spider Pro se ofrece "tal cual" ("as is"), sin garantías de ningún tipo, expresas o implícitas. En
          la medida permitida por la ley, no somos responsables por pérdidas, daños o perjuicios derivados
          del uso de la plataforma o de decisiones financieras reales que tomes basándote, total o
          parcialmente, en el contenido educativo aquí presentado. Cualquier decisión de invertir o operar
          con dinero real es exclusivamente tuya y bajo tu propio riesgo.
        </p>
      </LegalSection>

      <LegalSection
        title="7. Propiedad intelectual"
        summary="El diseño, el código y el contenido de Spider Pro nos pertenecen, salvo lo indicado."
      >
        <p>
          El diseño, código, textos, marca y contenido original de Spider Pro son propiedad de sus creadores,
          salvo los componentes de código abierto de terceros expresamente atribuidos (por ejemplo,
          TradingView Lightweight Charts).
        </p>
      </LegalSection>

      <LegalSection
        title="8. Cambios en el servicio y en estos términos"
        summary="Podemos modificar la plataforma o estos términos; los cambios importantes se avisarán en el sitio."
      >
        <p>
          Podemos modificar, agregar o discontinuar funciones de la plataforma, así como actualizar estos
          Términos y Condiciones, en cualquier momento. Los cambios relevantes se reflejarán con una nueva
          fecha de "última actualización" en esta página.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
