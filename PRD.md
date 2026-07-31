# PRD — Spider Pro
### Plataforma de Análisis Técnico y Contexto Cripto en Tiempo Real

**Versión:** 1.0
**Estado:** En producción — 13 secciones funcionales, datos en vivo, asistente conversacional integrado.

---

## 1. Resumen Ejecutivo

Spider Pro es una plataforma web de análisis técnico y contexto de mercado para criptomonedas, enfocada en Bitcoin (BTC) y TRON (TRX). Combina gráficas de velas profesionales con indicadores técnicos configurables, un motor de interpretación automática ("Spider") que traduce señales técnicas a lenguaje simple, contenido educativo estructurado, y un asistente conversacional que responde preguntas ancladas a los datos reales que el usuario tiene en pantalla en cada momento.

### Objetivo del producto

Que cualquier persona — desde alguien que recién empieza hasta un trader activo — pueda seguir BTC y TRX con indicadores técnicos configurables en 10 temporalidades distintas, entender el contexto macro y de ciclo que rodea al mercado (halvings, M2, sentimiento), y resolver dudas puntuales conversando con un asistente que nunca inventa cifras: solo usa los datos verificados que la aplicación ya calculó.

### A quién sirve

- **Principiantes**: Academia de indicadores, guía de patrones de velas japonesas, guía práctica de inversión, calculadora de escenarios sin jerga.
- **Traders activos**: Análisis técnico con RSI/MACD/Bollinger/medias móviles configurables sobre las 10 temporalidades estándar del mercado, detección automática de cruces (Golden Cross / Death Cross).
- **Holders de largo plazo**: Contexto de ciclo (fase post-halving, M2 vs precio, base de datos de crashes históricos con tasas de recuperación).
- **Seguidores del ecosistema TRON**: Métricas de red en vivo, dominancia de stablecoins, roadmap del proyecto, contexto sobre su fundador.

---

## 2. Stack Tecnológico

### Frontend — `apps/web`
- **Vite + React 18 + TypeScript** — SPA, tipado estricto (`strict: true`) en todo el código.
- **TailwindCSS** — sistema de diseño "cyber-finance": fondo casi negro, acentos neón verde/rojo/azul/dorado, tipografía monoespaciada (JetBrains Mono) para todos los valores numéricos.
- **TanStack Query** — fetch, caché y revalidación automática de todos los datos de mercado (polling configurado por tipo de dato: precios cada 30s, Fear & Greed cada 5min, stats de red cada 60s).
- **React Router** — navegación entre las 13 secciones.
- **Zustand** — estado global ligero (contexto de página compartido con el asistente conversacional).
- **Zod** — validación de todo dato proveniente del backend antes de tocar la UI.
- **lightweight-charts (TradingView, open source)** — gráficas de velas profesionales: candlesticks, overlays de medias móviles y Bandas de Bollinger, paneles de RSI/MACD sincronizados por rango visible.
- **Web Workers + Comlink** — todo cálculo de indicadores técnicos corre fuera del hilo principal, para que cambiar de temporalidad nunca bloquee la interfaz.

### Backend — `apps/api`
- **Node.js + Fastify + TypeScript** — API propia que centraliza y valida cada llamada a un proveedor de datos externo.
- **Empaquetado dual**: build standalone (`node dist/index.js`, para correr como servidor persistente en cualquier host) y build como función serverless autocontenida (`netlify/functions/api.js`, sin dependencias de `node_modules` en runtime) para Netlify.
- **Caché en memoria de corta duración** por endpoint, para no repetir llamadas idénticas a proveedores externos en cada poll de cada usuario.
- Ningún dato sensible (API keys) se envía jamás al navegador — todo pasa por este backend.

### Paquetes compartidos
- **`packages/indicators`** — RSI, MACD, Bandas de Bollinger, SMA y EMA en TypeScript puro, sin dependencias de React ni del navegador (usable también desde el backend en el futuro, p. ej. para un motor de alertas).
- **`packages/types`** — schemas Zod compartidos entre frontend y backend (velas, temporalidades, respuestas de mercado, chat).

### Infraestructura
- **Netlify** — hosting único para frontend (sitio estático) y backend (función serverless), mismo origen, sin CORS entre ellos.
- **Turborepo + pnpm workspaces** — monorepo con cacheo de builds por paquete.

---

## 3. Arquitectura General

```
Proveedores de datos externos
├── Binance                    (velas OHLCV — fuente primaria)
├── Bybit                      (velas OHLCV — fallback 1)
├── CryptoCompare               (velas OHLCV — fallback 2, requiere key opcional)
├── CoinGecko                   (velas OHLCV fallback final; precio/market cap/ATH; supply de stablecoins)
├── Alternative.me               (índice Fear & Greed)
├── FRED (Reserva Federal)       (oferta monetaria M2, serie M2SL)
├── TronScan / TronGrid          (métricas de red TRON en vivo — requiere key)
└── xAI (Grok)                   (motor conversacional del asistente)
         │
         ▼
Backend (Fastify, apps/api)
├── Un módulo "provider" por fuente externa — aísla URL base, key y parseo
├── Rutas propias (/api/*) — únicas que el frontend conoce
├── Cadenas de fallback automáticas (ver sección 5)
└── Caché en memoria de corta duración
         │
         ▼
Frontend (React + Vite)
├── 13 secciones navegables
├── Web Worker: cálculo de indicadores técnicos
└── Asistente conversacional flotante, presente en todas las secciones
```

**Principio de diseño clave:** el backend es la única pieza que conoce URLs de proveedores externos y credenciales. El frontend solo conoce sus propias rutas `/api/*`, todas en el mismo origen.

---

## 4. APIs y Fuentes de Datos

### 4.1 Proveedores externos integrados

| Proveedor | Uso | Autenticación |
|---|---|---|
| **Binance** (`api.binance.com`) | Velas OHLCV, fuente primaria, todas las temporalidades | Ninguna |
| **Bybit** (`api.bybit.com`) | Velas OHLCV, fallback 1, todas las temporalidades | Ninguna |
| **CryptoCompare** (`min-api.cryptocompare.com`) | Velas diarias, fallback 2 | Opcional (key gratuita recomendada; sin ella esa capa se salta automáticamente) |
| **CoinGecko** (`api.coingecko.com`) | Fallback final de velas; precio/market cap/ATH/% de cambio; historial 30 días; supply de stablecoins | Ninguna |
| **Alternative.me** (`api.alternative.me`) | Índice Fear & Greed | Ninguna |
| **FRED / Reserva Federal** (`fred.stlouisfed.org`) | Serie M2SL (oferta monetaria M2 de EE. UU.), histórico completo desde 1959 | Ninguna |
| **TronScan** (`apilist.tronscanapi.com`) | Cuentas totales, transacciones, TPS, TVL, nodos, contratos, supply de USDT-TRC20, holders | Requerida (header `TRON-PRO-API-KEY`) |
| **TronGrid** (`api.trongrid.io`) | Altura de bloque (fallback si TronScan falla) | Requerida |
| **xAI / Grok** (`api.x.ai`) | Motor de lenguaje del asistente conversacional | Requerida |

### 4.2 Endpoints propios del backend (`apps/api`)

| Endpoint | Método | Descripción |
|---|---|---|
| `/health` | GET | Estado del servicio |
| `/api/klines` | GET | Velas OHLCV — parámetros `symbol`, `interval` (una de las 10 temporalidades), `limit`. Ejecuta la cadena de fallback completa. |
| `/api/market/coins` | GET | Precio, market cap, ATH, % de cambio (1h/24h/7d/30d/1y) — parámetro `ids` (`bitcoin,tron`) |
| `/api/market/history` | GET | Serie de precios de los últimos N días — parámetros `asset`, `days` |
| `/api/market/fear-greed` | GET | Valor y clasificación del índice Fear & Greed |
| `/api/market/m2` | GET | Serie M2 (FRED) + precio mensual de BTC/TRX para comparación |
| `/api/market/stablecoins` | GET | Supply y holders en vivo de USDT/USDC/USDD/TUSD/USDJ en TRON |
| `/api/tron/stats` | GET | Cuentas, transacciones, TPS, TVL, nodos, contratos de la red TRON |
| `/api/chat` | POST | Mensaje al asistente conversacional — recibe `message`, `page`, `context` (datos verificados de la página actual) e `history` |

### 4.3 Cadena de fallback de velas (`/api/klines`)

Para maximizar disponibilidad, cada temporalidad intenta las fuentes en este orden hasta obtener una respuesta válida:

1. **Binance** — todas las temporalidades.
2. **Bybit** — todas las temporalidades (mismo formato de símbolo que Binance).
3. **CryptoCompare** — solo temporalidad diaria.
4. **CoinGecko** — solo temporalidad diaria, último recurso.

La respuesta incluye qué fuente respondió (`source`), para trazabilidad.

### 4.4 Resiliencia de otras fuentes

- **TronScan**: 3 intentos en cadena (con key → sin key → TronGrid) antes de caer a un set de valores de referencia estático, para que la sección de TRON nunca quede vacía.
- **M2**: si FRED no responde, cae a un dataset de referencia estático — la interfaz lo indica explícitamente (nunca presenta un dato viejo como si fuera en vivo).
- **CryptoCompare**: si no hay key configurada, esa capa del fallback se salta automáticamente sin afectar al resto de la cadena.

---

## 5. Funcionalidades — Las 13 Secciones

| Sección | Contenido |
|---|---|
| **Spider Intelligence** (landing) | Motor de mensajes que combina el índice Fear & Greed, precio y distancia al ATH de BTC/TRX en una lectura de "zona de compra / neutral / zona de venta"; hero cards con precio y % de cambio en 5 marcos de tiempo; guía estática de señales de compra/venta |
| **Bitcoin** | Precio en vivo, ATH, market cap, ficha técnica del activo, gráfica de 30 días, interpretación automática según el movimiento de 24h |
| **TRON** | Igual que Bitcoin + grid de 10 métricas de red en vivo (cuentas, TX, TPS, TVL, nodos, contratos) + proyecciones de valor a distintos precios objetivo |
| **Análisis Técnico** | Velas japonesas interactivas en las 10 temporalidades (1m, 3m, 5m, 15m, 1h, 2h, 4h, 1d, 1w, 1M) para BTC o TRX, con RSI, MACD, Bandas de Bollinger y medias móviles (SMA/EMA) configurables como overlays; detección automática de cruces Golden Cross / Death Cross con explicación en lenguaje simple; señal compuesta (alcista/neutral/bajista) derivada de la confluencia de indicadores; academia con 4 guías a fondo (RSI, MACD, Bollinger, medias y cruces) |
| **Velas Japonesas** | Academia de 10 patrones de velas (martillo, envolventes, estrellas de la mañana/tarde, doji, etc.) con contexto, psicología de mercado, fiabilidad, cómo confirmarlos y cómo operarlos — cada patrón se ilustra con un ícono SVG generado a partir de sus valores OHLC reales, no un emoji genérico |
| **Estrategias & Cómo Invertir** | Resumen de la filosofía de 6 inversores/traders reconocidos + guía práctica de 6 pasos (seguridad, DCA, gestión de riesgo, dónde comprar, DYOR, fiscalidad) |
| **Halvings BTC** | Línea de tiempo de los halvings históricos de Bitcoin + proyección del próximo, tabla de retornos históricos por fase, guía de decisión según la fase actual del ciclo (con ROI calculado en vivo) |
| **M2 vs Mercado** | Comparación de doble eje entre la oferta monetaria M2 (en vivo vía FRED) y el precio de BTC/TRX en escala logarítmica, con badge de estado de conexión en vivo |
| **Stablecoins TRON** | Supply en vivo de las 5 stablecoins principales en TRON, holders de USDT, crecimiento histórico por trimestre, explicación de por qué el supply de stablecoins importa para la demanda de TRX |
| **Crashes Históricos** | Base de datos de caídas históricas de BTC y TRX con % de caída, retornos a 6/12/18/24/36 meses, win-rate agregado y retorno mediano — la caída "en curso" se recalcula en vivo con el precio actual |
| **TRON Roadmap** | Las 6 fases del roadmap del proyecto, con la fase activa expandida por defecto y una barra de progreso |
| **Justin Sun** | Perfil biográfico del fundador de TRON: trayectoria, hitos, controversias y cifras clave — tono neutral/informativo |
| **Calculadora** | Calculadora de escenarios de precio, conversor instantáneo entre BTC/TRX/USD, proyecciones de valor sobre montos de TRX |

### Asistente conversacional ("Spider Chat")

Widget flotante presente en las 13 secciones, con conversación persistente al navegar entre ellas. Cada sección publica un snapshot de sus datos en pantalla (precio, RSI, señal técnica, etc.) a un store compartido; el asistente recibe ese snapshot como contexto en cada mensaje.

**Regla de diseño no negociable**: el modelo de lenguaje nunca puede usar su propio conocimiento para afirmar una cifra de mercado — el system prompt lo obliga a ceñirse exclusivamente a los datos verificados que la sección actual publicó, y a responder explícitamente "no tengo ese dato ahora mismo" ante cualquier pregunta fuera de ese contexto, en vez de inventar un número.

---

## 6. Requisitos No Funcionales

| Categoría | Requisito |
|---|---|
| Rendimiento | Cambio de temporalidad recalcula indicadores y re-renderiza sin bloquear la interfaz (cálculo en Web Worker) |
| Disponibilidad de datos | Cadena de fallback de mínimo 2 fuentes para velas y métricas de red; ninguna sección queda completamente vacía ante la caída de un proveedor |
| Seguridad | Ninguna API key se expone al cliente — todo pasa por el backend; variables de entorno para toda credencial, ninguna hardcodeada |
| Accesibilidad | Contraste alto sobre fondo oscuro, tipografía monoespaciada para lectura precisa de cifras |
| Idioma | Español como idioma principal de toda la interfaz y el contenido |
| Cumplimiento | Todo indicador, señal o proyección va acompañado de disclaimer NFA (Not Financial Advice) |
| Observabilidad | Logs estructurados en el backend, con `source` explícito en cada respuesta que dependió de una cadena de fallback |

---

## 7. Empaquetado y Despliegue

Un solo comando construye y empaqueta la aplicación completa:

```bash
pnpm run build
```

Esto genera, en la raíz del proyecto:

- **`dist/`** — sitio estático del frontend, listo para publicarse tal cual (`index.html`, `assets/`, reglas de redirección para el enrutamiento del lado del cliente).
- **`netlify/functions/api.js`** — el backend completo empaquetado como una única función serverless autocontenida (sin dependencias de `node_modules` en tiempo de ejecución).

Frontend y backend se despliegan **al mismo sitio/dominio** — no se requiere infraestructura de backend separada. La URL del backend se resuelve en tiempo real en el navegador del visitante (mismo origen), sin necesidad de configurar una URL fija por entorno.

### Variables de entorno requeridas en producción

| Variable | Obligatoria | Propósito |
|---|---|---|
| `TRONSCAN_API_KEY` | Recomendada | Métricas de red TRON en vivo (sin ella, cae a valores de referencia) |
| `XAI_API_KEY` | Para el asistente conversacional | Sin ella, el chat responde con un aviso en vez de fallar |
| `CRYPTOCOMPARE_API_KEY` | Opcional | Reactiva esa capa del fallback de velas |

Ninguna URL base de proveedor requiere configuración — todas tienen un valor por defecto correcto y son overrideables solo si hiciera falta apuntar a un mirror o proxy propio.

---

## 8. Riesgos y Mitigaciones

| Riesgo | Mitigación |
|---|---|
| Rate limits o bloqueos de APIs públicas | Cadena de fallback de múltiples proveedores por tipo de dato + caché en memoria de corta duración en el backend |
| Falsos positivos en señales técnicas (ruido de mercado) | La señal compuesta requiere confluencia de al menos 2 de 3 indicadores antes de marcar alcista/bajista; toda señal se presenta como contexto, nunca como orden de compra/venta |
| El asistente conversacional inventa una cifra | Diseño de system prompt que restringe estrictamente el modelo a datos verificados inyectados por la aplicación, con instrucción explícita de admitir cuando no tiene un dato |
| Caída de un proveedor de datos crítico | Cobertura de fallback de al menos 2 fuentes independientes en cada tipo de dato de mercado |

---

## 9. Roadmap Futuro

- **Cobertura de más tokens**: hoy la plataforma cubre BTC y TRX en profundidad; extender el buscador y el análisis técnico a un catálogo más amplio de activos (exchanges centralizados y tokens on-chain).
- **Motor de alertas**: reglas configurables (cruce de medias, RSI en zona extrema, ruptura de Bandas de Bollinger) evaluadas en segundo plano, con notificación aunque el usuario no tenga la aplicación abierta.
- **Cuentas de usuario**: watchlists y configuración de indicadores persistentes entre sesiones (hoy la configuración vive solo en el estado de cada sesión del navegador).
- **Herramientas de dibujo sobre gráficas**: líneas de tendencia, soportes/resistencias, retroceso de Fibonacci.
- **Módulo de portafolio**: registro de posiciones propias con P&L en vivo.
- **Streaming en tiempo real**: migrar de sondeo periódico a WebSocket para reducir la latencia de actualización de precio.

---

*Documento vivo — refleja el estado actual del producto en producción.*
