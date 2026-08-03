import { LegalPageLayout, LegalSection } from "../../components/legal/LegalPageLayout";

export function RiesgoPage() {
  return (
    <LegalPageLayout title="Aviso de Riesgo">
      <div className="bg-neon-red/10 border border-neon-red/40 rounded-lg p-4 mb-2">
        <p className="text-sm text-neon-red font-semibold leading-relaxed">
          El trading de criptomonedas es de alto riesgo. La mayoría de los traders minoristas pierde dinero.
          Nada en Spider Pro constituye asesoría financiera.
        </p>
      </div>

      <LegalSection
        title="1. El trading de criptomonedas es de alto riesgo"
        summary="Los precios de las criptomonedas son extremadamente volátiles. Podés perder parte o todo tu capital."
      >
        <p>
          Las criptomonedas son activos altamente volátiles. Su precio puede moverse con violencia en minutos
          por razones que incluyen noticias, liquidez limitada, regulación, y manipulación de mercado. Operar
          con dinero real implica un riesgo real de pérdida parcial o total del capital invertido.
        </p>
      </LegalSection>

      <LegalSection
        title="2. La mayoría de los traders minoristas pierde dinero"
        summary="Es un hecho documentado en múltiples mercados, no una posibilidad remota."
      >
        <p>
          Estudios públicos sobre trading minorista apalancado (en forex, CFDs y derivados cripto) muestran
          consistentemente que la mayoría de las cuentas retail pierde dinero en el mediano plazo. No te
          contamos esto para desalentarte — te lo contamos porque es la información más importante que un
          principiante necesita antes de arriesgar capital real, y la mayoría de las plataformas no te la
          dice.
        </p>
      </LegalSection>

      <LegalSection
        title="3. El apalancamiento amplifica pérdidas, no solo ganancias"
        summary="Con apalancamiento podés perder el 100% del margen de una posición, incluso con movimientos de precio pequeños."
      >
        <p>
          Operar con apalancamiento (contratos de futuros/margen) amplifica tanto ganancias como pérdidas en
          la misma proporción. A mayor apalancamiento, menor es el movimiento de precio necesario para
          liquidar tu posición completa. Ver la sección{" "}
          <a href="/app/contratos" className="text-neon-blue hover:underline">
            Contratos y Apalancamiento
          </a>{" "}
          de la app para el detalle técnico completo.
        </p>
      </LegalSection>

      <LegalSection
        title="4. Los resultados en el simulador NO predicen resultados reales"
        summary="Operar sin las emociones del dinero real, sin slippage real y sin liquidez real es distinto a operar en serio."
      >
        <p>
          El desempeño dentro de la Terminal, el Arcade o cualquier simulador de Spider Pro no es indicativo
          de cómo te iría operando con dinero real. Los simuladores no replican perfectamente el slippage, la
          liquidez real del mercado, las comisiones de cada exchange, ni — sobre todo — la presión psicológica
          de arriesgar dinero que de verdad podés perder.
        </p>
      </LegalSection>

      <LegalSection
        title="5. Nada acá es asesoría financiera"
        summary="Spider Pro es educativo. Ninguna herramienta, señal o mensaje del chat es una recomendación de inversión."
      >
        <p>
          Ningún indicador, calculadora, mensaje del Spider Chat, "Spider Score" o contenido de la Academia
          constituye asesoría financiera, de inversión, legal ni fiscal. Todo el contenido es educativo y
          general. Antes de operar con dinero real, considerá consultar con un asesor financiero
          matriculado y evaluar tu propia situación y tolerancia al riesgo.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
