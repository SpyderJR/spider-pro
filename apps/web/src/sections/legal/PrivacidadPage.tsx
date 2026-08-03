import { LegalPageLayout, LegalSection } from "../../components/legal/LegalPageLayout";

export function PrivacidadPage() {
  return (
    <LegalPageLayout title="Política de Privacidad">
      <LegalSection
        title="1. Qué datos recopilamos"
        summary="Sin cuenta: nada sale de tu navegador. Con cuenta Google: tu perfil básico y tu progreso."
      >
        <p>
          <strong className="text-slate-200">Sin iniciar sesión:</strong> todo tu progreso (Academia, Arcade,
          Terminal, Diario, ajustes) se guarda únicamente en el almacenamiento local de tu propio navegador
          (localStorage / IndexedDB). No enviamos esos datos a nuestros servidores.
        </p>
        <p>
          <strong className="text-slate-200">Con cuenta de Google (opcional):</strong> almacenamos tu nombre,
          email y foto de perfil provistos por Google, más tu progreso de la plataforma (niveles completados,
          logros, historial de trades simulados, entradas del diario, ajustes), para poder respaldarlo y
          sincronizarlo entre tus dispositivos.
        </p>
        <p>
          Los mensajes que enviás a Spider Chat se procesan por el proveedor de inteligencia artificial que
          genera las respuestas, únicamente con el fin de responderte.
        </p>
      </LegalSection>

      <LegalSection
        title="2. Qué NO hacemos"
        summary="No vendemos datos. No mostramos publicidad."
      >
        <p>No vendemos ni alquilamos tus datos a terceros. No mostramos publicidad de terceros en la plataforma.</p>
      </LegalSection>

      <LegalSection
        title="3. Servicios de terceros que usamos"
        summary="Supabase (auth y base de datos), Google OAuth, Netlify (hosting), Binance y alternative.me (datos de mercado), y un proveedor de IA para el chat."
      >
        <ul className="list-disc list-inside space-y-1">
          <li><strong className="text-slate-200">Supabase</strong> — autenticación e infraestructura de base de datos, si elegís crear una cuenta.</li>
          <li><strong className="text-slate-200">Google OAuth</strong> — para el inicio de sesión con Google (opcional).</li>
          <li><strong className="text-slate-200">Netlify</strong> — alojamiento del sitio y las funciones del backend.</li>
          <li><strong className="text-slate-200">Binance / alternative.me / FRED / CoinGecko</strong> — datos públicos de mercado, sin que se les envíen datos personales tuyos.</li>
          <li><strong className="text-slate-200">Proveedor de IA</strong> — procesa el contenido de tus mensajes de chat para generar respuestas.</li>
        </ul>
      </LegalSection>

      <LegalSection
        title="4. Cookies y almacenamiento local"
        summary="Usamos localStorage/IndexedDB para guardar tu progreso y preferencias — no cookies de rastreo publicitario."
      >
        <p>
          Usamos el almacenamiento local del navegador (localStorage e IndexedDB) para guardar tu progreso,
          preferencias, aceptación de términos y caché de datos de mercado. Si iniciás sesión, usamos también
          una cookie/token de sesión de Supabase para mantenerte autenticado. No usamos cookies de rastreo
          publicitario de terceros.
        </p>
      </LegalSection>

      <LegalSection
        title="5. Tus derechos"
        summary="Podés acceder, exportar o eliminar tus datos en cualquier momento desde el menú de cuenta."
      >
        <p>
          Si tenés una cuenta, desde el menú de cuenta del dashboard podés: exportar todos tus datos en
          formato JSON, y eliminar tu cuenta junto con todos tus datos de forma permanente. Si no tenés
          cuenta, tus datos viven solo en tu navegador — podés borrarlos vos mismo desde el respaldo de datos
          del menú de ajustes, o limpiando el almacenamiento del sitio desde tu navegador.
        </p>
      </LegalSection>

      <LegalSection
        title="6. Retención de datos"
        summary="Guardamos tus datos de cuenta hasta que decidas eliminarla."
      >
        <p>
          Si creaste una cuenta, conservamos tus datos mientras la cuenta exista. Al eliminar tu cuenta,
          borramos tus filas de todas nuestras tablas y tu registro de autenticación de forma permanente.
        </p>
      </LegalSection>

      <LegalSection
        title="7. Contacto"
        summary="Para consultas de privacidad, escribinos por X."
      >
        <p>
          Para consultas relacionadas con privacidad o tus datos, podés contactarnos por{" "}
          <a
            href="https://x.com/Spyde3rAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue hover:underline"
          >
            X (@Spyde3rAI)
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
