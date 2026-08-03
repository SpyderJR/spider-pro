# Setup — Cuenta con Google (Supabase)

Spider Pro funciona **completo sin ninguno de estos pasos** — todo el progreso se guarda en
el navegador (localStorage/IndexedDB) y el login con Google es 100% opcional. Estos pasos solo
son necesarios si querés habilitar el respaldo en la nube y la sincronización entre dispositivos
(Bloque 11.2). Todo esto usa exclusivamente la capa gratuita de Supabase — nada de pago.

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta (gratis).
2. Creá un nuevo proyecto — elegí la región más cercana a tus usuarios. El plan **Free** alcanza
   para todo este bloque (Auth + Postgres, sin límite de tiempo, con límites generosos de fila y
   de usuarios activos mensuales).
3. Cuando el proyecto termine de aprovisionarse, andá a **Project Settings → API** y copiá:
   - `Project URL` → esto es `SUPABASE_URL`.
   - `anon public` key → esto es `SUPABASE_ANON_KEY`.
   - `service_role` key (¡secreta, nunca la expongas en el navegador!) → esto es
     `SUPABASE_SERVICE_ROLE_KEY`, solo va en el servidor (Netlify).

## 2. Correr el esquema de la base de datos

1. En el panel de Supabase, andá a **SQL Editor**.
2. Pegá el contenido completo de [`supabase/schema.sql`](./supabase/schema.sql) de este repo y
   ejecutalo. Esto crea las tablas (`profiles`, `academy_progress`, `arcade_stats`,
   `terminal_state`, `settings`, `achievements`, `journal_entries`), activa Row Level Security en
   todas, y crea el trigger que arma el perfil automáticamente cuando alguien se registra.

## 3. Habilitar el proveedor de Google

1. En Supabase: **Authentication → Providers → Google** → activalo.
2. Vas a necesitar un **Client ID** y **Client Secret** de Google — se consiguen en el siguiente
   paso. Supabase te muestra acá mismo la **Redirect URL** que tenés que copiar para el paso 4
   (algo como `https://<tu-proyecto>.supabase.co/auth/v1/callback`).

## 4. Crear las credenciales OAuth en Google Cloud Console

1. Entrá a [Google Cloud Console](https://console.cloud.google.com/) → creá un proyecto (o usá
   uno existente).
2. **APIs & Services → OAuth consent screen**: configurá la pantalla de consentimiento (tipo
   "External", nombre de la app "Spider Pro", tu email de soporte).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Tipo de aplicación: **Web application**.
   - **Authorized redirect URIs**: pegá la Redirect URL que te dio Supabase en el paso 3.
   - **Authorized JavaScript origins**: agregá el dominio de tu sitio (ej.
     `https://spider-pro-ai.netlify.app`) y `http://localhost:5174` para desarrollo local.
4. Copiá el **Client ID** y **Client Secret** generados y pegalos en Supabase (paso 3, en los
   campos correspondientes del proveedor Google). Guardá.

## 5. Variables de entorno

**En Netlify** (Site settings → Environment variables), agregá:

| Variable | Valor | Dónde se usa |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL del paso 1 | Frontend (build de Vite) |
| `VITE_SUPABASE_ANON_KEY` | anon public key del paso 1 | Frontend (build de Vite) |
| `SUPABASE_URL` | Project URL del paso 1 | Backend (Netlify Function) |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key del paso 1 — **secreta** | Backend (Netlify Function), solo para verificar sesiones y borrar cuentas |

**En desarrollo local**, copiá `apps/web/.env.example` a `apps/web/.env` y completá
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`; y agregá `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`
al `.env` de la raíz del repo (mismo archivo que ya tiene `XAI_API_KEY`, etc.).

**Nunca commitees ninguna de estas claves.** `.env` y `.env.local` ya están en `.gitignore`.

## 6. Verificar que funciona

1. Reiniciá el servidor de desarrollo (o esperá el redeploy de Netlify) después de setear las
   variables.
2. En el dashboard (`/app`), debería aparecer un botón "Iniciar sesión" en la esquina superior
   derecha (antes de configurar esto, el botón simplemente no aparece — la app sigue funcionando
   igual).
3. Iniciá sesión con una cuenta de Google de prueba, generá algo de progreso, cerrá sesión,
   volvé a entrar desde otro navegador/perfil y confirmá que el progreso está ahí.
4. Probá "Eliminar mi cuenta" desde el menú y confirmá en el SQL Editor de Supabase que las filas
   de esa cuenta desaparecieron de todas las tablas.

---

Sin estos pasos, todo lo demás en Spider Pro sigue funcionando exactamente igual — esto es una
capa opcional encima de una app que ya es 100% funcional sin cuenta.
