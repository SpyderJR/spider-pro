# SPIDER PRO — Plataforma Educativa Completa — TODO

Trabajo en orden estricto 1→9. Cada bloque se marca `[x]` solo después de:
build limpio (`pnpm run build`) + verificación en navegador de lo construido en ese bloque.

**Regla de oro:** costo cero (sin DB de pago, sin login, sin APIs de pago salvo el
chat ya existente con rate limit), datos de mercado vía REST/WS públicos de Binance
+ alternative.me, todo en localStorage/IndexedDB, disclaimer NFA en cada página nueva.

---

## Bloque 1 — Terminal de Paper Trading (la joya de la corona) ✅

- [x] Capa de datos Binance: REST (klines, ticker 24h) + WebSocket (kline stream, depth, trades) — `lib/binance/`
- [x] Store de paper trading persistido (Zustand) — `lib/paperTrading/store.ts`
- [x] Motor de ejecución: mercado, límite, SL/TP evaluados contra cada tick — `lib/paperTrading/engine.ts`
- [x] Motor de feedback educativo (16 reglas) — `lib/tradeFeedback.ts`
- [x] Zona superior: barra del par (precio live, 24h, balance, P&L del día)
- [x] Zona central: gráfico lightweight-charts + indicadores (Fractales, Alligator, Pivots, EMA 20/50/200, Volumen, RSI, AO) + líneas de posición (entrada/SL/TP)
- [x] Zona derecha: panel de orden (Comprar/Vender, Mercado/Límite, cantidad+slider, SL/TP con riesgo en vivo, R:R)
- [x] Order book + trades en vivo (websocket depth/trades)
- [x] Zona inferior: Posiciones / Órdenes / Historial / Estadísticas
- [x] Nav entry "Terminal" debajo de "Radar de Trading" + ruta
- [x] Responsive móvil (grid colapsa a 1 columna en `lg:`)
- [x] Build limpio + verificación en navegador (probado en vivo: apertura y cierre de trade real, feedback generado correctamente)

**Nota de alcance:** las líneas de SL/TP se ven en el gráfico y son editables por input numérico en la
tabla de Posiciones (según lo pedido), pero no son arrastrables con el mouse directamente sobre el
gráfico — eso requeriría un plugin de mouse-tracking custom sobre lightweight-charts que no entra en
el alcance razonable de este bloque. Si querés que lo agregue como mejora puntual, avisame.

## Bloque 2 — Gestión de Riesgo y Psicología ✅

- [x] Calculadora de tamaño de posición (balance, %riesgo, entrada, SL)
- [x] Calculadora R:R + tabla de win rate mínimo necesario
- [x] Simulador de rachas (100 trades, slider % riesgo, curva de balance)
- [x] Tabla "% perdido vs % necesario para recuperar"
- [x] Cards de psicología (FOMO, revenge trading, sesgo de confirmación, exceso de confianza, aversión a la pérdida)
- [x] "Reglas de supervivencia" card final
- [x] Enlace desde avisos de riesgo >3% de la Terminal (verificado: navega correctamente a /gestion-de-riesgo)
- [x] Nav entry "Gestión de Riesgo" (ícono escudo) debajo de "Terminal" + ruta
- [x] Build limpio + verificación en navegador (probado en vivo: las 3 calculadoras, el simulador de rachas, el aviso >3% y la navegación desde la Terminal)

## Bloque 3 — Spider Chat con contexto de mercado en vivo ✅

- [x] `lib/marketContext.ts` — snapshot compacto (precios, F&G, ATH, fractales 4h/1d, Alligator, cuenta Terminal)
- [x] Inyección al system prompt en cada llamada (bloque separado "CONTEXTO DE MERCADO", siempre disponible sin importar la página)
- [x] Prompt de mentor paciente, NFA, nunca "comprá/vendé"
- [x] Rate limit 15 msj/día — localStorage (`store/chatRateLimitStore.ts`) + Netlify Function por IP (`lib/chatRateLimit.ts`, in-memory)
- [x] Contador visible "X/15 hoy" en el header del chat
- [x] Build limpio + verificación en navegador (probado en vivo: pregunté por fractales y Alligator desde Spider Intelligence —no la Terminal— y respondió con datos reales y actuales; contador decrementó de 15 a 14 correctamente)

**Nota de alcance:** el rate limit del lado servidor usa un contador en memoria (Map), no una base de
datos — es "best effort" y se resetea si la función de Netlify hace cold start, tal como se documenta en
el código. El contador de localStorage del lado cliente es la defensa principal y persiste siempre para
un mismo navegador. Cumple "costo cero" sin agregar infraestructura nueva.

## Bloque 4 — Academia (ruta de aprendizaje) ✅

- [x] 5 niveles con progreso visual, enlazando a pestañas existentes — `data/academyLevels.ts`
- [x] `data/quizzes.ts` — 8 preguntas por nivel con explicación (40 preguntas totales)
- [x] Aprobación 80%, desbloqueo solo visual (no bloqueante)
- [x] Racha de días + % completado en sidebar — `store/academyProgressStore.ts`
- [x] Nav entry "Academia" (primera tras Spider Intelligence) + ruta
- [x] Build limpio + verificación en navegador (probado en vivo: recorrido de niveles, quiz completo pregunta a pregunta con coloreado correcto/incorrecto + explicación, pantalla de resultado con mensaje no-bloqueante al reprobar, estado "COMPLETADO" con mejor puntaje al simular aprobación, racha/progreso del sidebar actualizándose de 1 día/0% a 3 días/40%, enlaces de material navegando a las pestañas correctas, barrido de regresión sin errores de consola en /, /terminal, /gestion-de-riesgo, /fractales-estructura)

## Bloque 5 — Spider Arcade (6 juegos) ✅

- [x] Menú Arcade (6 cards, récord, JUGAR) — `sections/ArcadePage.tsx`
- [x] Juego 1: Sube o Baja — predicción de vela, 3 vidas, 20 rondas, racha con multiplicador
- [x] Juego 2: Caza el Fractal (+ modo Caza el BOS desbloqueable) — `lib/fractals.ts` + `lib/arcade/bos.ts`, dificultad progresiva (tiempo decreciente)
- [x] Juego 3: El Impostor — 3 gráficos (2 reales + 1 random walk vía `lib/arcade/randomWalk.ts`)
- [x] Juego 4: Stop Loss Perfecto — SL por clic en vela, puntaje por reglas (distancia, confluencia con fractal, resultado tras 20 velas)
- [x] Juego 5: ¿Qué Crash Es? — gráfico histórico real sin escalas, reusa `data/crashes.ts`, 8 rondas
- [x] Juego 6: Sobrevive los 20 — $1000, 20 escenarios reales, comparación en vivo vs estrategia de 1% de riesgo fijo
- [x] XP y niveles temáticos (Novato → Spider Trader) — `lib/arcade/xp.ts`
- [x] `data/achievements.ts` — 25 logros con toast de desbloqueo
- [x] Desafío diario determinista por fecha (XP x2) + racha — `lib/arcade/dailyChallenge.ts`
- [x] Panel de habilidad más débil con enlace a la pestaña educativa correspondiente
- [x] Histórico de Binance cacheado en IndexedDB (`lib/idbCache.ts`, `lib/arcade/historicalCandles.ts`) — reutilizable por el Bloque 7
- [x] Nav entry "Arcade" + ruta
- [x] Build limpio + verificación en navegador (probado en vivo: los 6 juegos abiertos y jugados en secuencia sin errores de consola, versión móvil verificada, barrido de regresión sin errores en las 19 rutas de la app)

## Bloque 6 — Diario de Trading ✅

- [x] Entradas automáticas desde trades cerrados de la Terminal (`syncFromTrades`, dedupe por `sourceTradeId`) + entradas manuales
- [x] Campos: razón, señales (checkboxes: fractal/pivote/BOS/RSI), emoción (confiado/ansioso/FOMO/aburrido/venganza), resultado, lección
- [x] Panel de análisis por reglas — win rate por emoción/señal/día de la semana/horario + insights en texto (`lib/diary/analysis.ts`, min. 3 muestras por bucket, min. 5 operaciones decididas para insights)
- [x] Botón de análisis por chat AI de las últimas 20 entradas (consume 1 mensaje del límite diario, reusa `postChat`)
- [x] Nav entry "Diario de Trading" (ícono 📔) debajo de "Gestión de Riesgo" + ruta
- [x] Build limpio + verificación en navegador (probado en vivo: entradas auto-creadas desde trades sembrados en la Terminal, edición en vivo de razón/lección/señales/emoción reflejada al instante en el panel de análisis, entrada manual creada y persistida tras reload, botón de IA hizo un round-trip real al chat y decrementó el contador de 15 a 14, barrido de regresión sin errores en las 20 rutas de la app)

## Bloque 7 — Replay de Mercado ✅

- [x] Toggle "Replay" dentro de la Terminal (no pestaña aparte) — `sections/TerminalPage.tsx`
- [x] Selección de 5 períodos históricos (COVID mar-2020, techo nov-2021, FTX nov-2022, halving abr-2024, fecha aleatoria) + temporalidad (15m/1h/4h), cacheado en IndexedDB (reusa `lib/arcade/historicalCandles.ts` del Bloque 5)
- [x] Play/pausa/velocidad (1x/2x/5x)/avance manual, cuenta separada de replay (`store/replayStore.ts`, persistida aparte de la cuenta en vivo)
- [x] Funcionalidad completa de Terminal contra el reloj de replay — reutiliza `TerminalChart`, `TerminalOscillators`, `IndicatorTogglesPanel`, `OrderPanel` y `ManagementTabs` sin duplicar código, con evaluación de SL/TP y órdenes límite por rango (mecha alta/baja) en vez de precio único — `lib/replay/engine.ts`
- [x] Resumen final vs. holdear + feedback basado en reglas (`lib/replay/summary.ts`), cierre automático de posiciones abiertas al finalizar
- [x] Build limpio + verificación en navegador (probado en vivo: replay de COVID marzo 2020 en 4h con fractales/EMA/RSI activos, posición abierta y bloqueo de posición duplicada, avance manual y reproducción a 5x, finalización con cierre automático de la posición y resumen correcto vs. holdear, vuelta a Terminal en vivo con la cuenta live intacta, verificación móvil, barrido de regresión sin errores en las 20 rutas de la app)

**Nota de alcance:** durante la verificación se encontró y corrigió una condición de carrera de `lightweight-charts` ("Object is disposed") que ya existía en `TerminalChart.tsx` pero nunca se había manifestado porque ese gráfico rara vez se desmonta en la Terminal en vivo — el Replay lo desmonta/remonta con mucha más frecuencia al cambiar entre configuración/activo/resumen, lo que la expuso. Se corrigió diferiendo la destrucción del chart un frame (mismo patrón ya usado en `ArcadeChart.tsx` del Bloque 5).

## Bloque 8 — Pulido transversal ✅

- [x] `data/glossary.ts` (69 términos, 6 categorías) + componente `<Term>` + `<TermifiedText>` (auto-detecta términos en un párrafo) + pestaña "Glosario" con búsqueda y filtro por categoría
- [x] Onboarding modal primera visita (3 pasos: bienvenida → nivel del usuario → ruta sugerida), gate por localStorage, redirige a Academia si el usuario es principiante
- [x] Respaldo unificado export/import JSON (Terminal, Academia, Arcade, Diario, Replay y preferencias — `lib/backup.ts`), accesible desde "⚙ Respaldo de datos" en el nav (desktop y móvil)
- [x] Revisión responsive completa (onboarding, glosario, respaldo, y los 8 bloques anteriores verificados en viewport móvil 390px)
- [x] Verificación costo cero + atribución lightweight-charts en footer del nav
- [x] Build limpio final, TODO.md 100%

**Nota de alcance:** `<TermifiedText>` se aplicó como demostración funcional en Academia (descripciones y temas de cada nivel) y en las cards de psicología de Gestión de Riesgo — ambas páginas ya muestran decenas de términos con tooltip en la práctica. Extender la envoltura a cada string de la app sería mecánico pero no aporta valor adicional real; el componente queda listo para usarse en cualquier texto nuevo con `<TermifiedText text={...} />`.

**Bug encontrado y corregido durante la verificación:** el modal de respaldo, montado inicialmente dentro de `<Nav>`, no se centraba ni oscurecía la pantalla — quedaba atrapado por el contexto de posicionamiento del `<nav sticky overflow-y-auto>` que lo contenía. Se resolvió moviendo el modal a la raíz de `App.tsx` (mismo patrón que `OnboardingModal` y `ChatWidget`) con un store de UI compartido (`store/uiStore.ts`) para abrir/cerrarlo desde el nav de escritorio y el de mobile.

**Verificación de costo cero:**
- Sin claves de API nuevas: todo el trabajo de los bloques 4-8 usa Binance REST/WS público (sin key) y `alternative.me` (sin key). Las únicas API keys del proyecto (`XAI_API_KEY` para el chat, `TRONSCAN_API_KEY` y `CRYPTOCOMPARE_API_KEY`, ambas de nivel gratuito y opcionales) ya existían antes de este trabajo.
- Rate limit del chat (15 msj/día) sigue activo y validado en cada bloque que lo usa (Academia no lo toca; Diario lo consume solo bajo acción explícita del usuario).
- Cacheo agresivo de histórico en IndexedDB (`lib/idbCache.ts`) reutilizado por Arcade y Replay — datos históricos que nunca cambian no se vuelven a pedir a Binance.
- Atribución de lightweight-charts visible: el logo "TV" en cada gráfico (parte de la librería) + texto explícito en el footer del nav.
- Todo el progreso del usuario vive en localStorage/IndexedDB del navegador — cero base de datos, cero login.

## Bloque 9 — Contratos y Apalancamiento ✅

**Filosofía obligatoria:** el riesgo va al frente. El apalancamiento nunca se presenta como
"ganar más" sino como herramienta que amplifica en ambas direcciones y liquida a la mayoría
de los principiantes. Tono claro y honesto — nunca alarmista, nunca promotor. Reglas
programadas, nunca IA. Diseño y disclaimers consistentes con el resto de la app.

### 9.1 — Pestaña "Contratos" ✅
- [x] Nav entry "Contratos" (ícono balanza) debajo de "Estrategias & Cómo Invertir" + ruta
- [x] Card Spot vs Contratos (3 niveles: 5 años / en serio / números) con SVG simple
- [x] Card Long y Short (3 niveles) con ejemplo numérico de cada uno
- [x] Card Apalancamiento (3 niveles) + tabla movimiento de precio vs efecto en cuenta (1x/5x/10x/25x/50x/100x)
- [x] Card Margen (3 niveles) — aislado vs cruzado, recomendación aislado para principiantes
- [x] Card Liquidación (la más grande/destacada, borde rojo) — analogía "el piso es lava" + números con 10x/50x/100x calculados con `lib/futures/liquidation.ts`
- [x] Card Funding rate (3 niveles)
- [x] Card Tamaño de posición con apalancamiento (corrige el error mental #1) con ejemplo completo
- [x] Simulador visual de liquidación interactivo (slider 1x-125x, long/short, franja de ruido calculada desde velas diarias reales de BTC, aviso rojo cuando la liquidación entra en el ruido)
- [x] Card de realidad (estadística honesta de traders apalancados) + disclaimer NFA reforzado
- [x] Build limpio + verificación en navegador (probado en vivo: las 7 cards con sus 3 niveles, tabla de apalancamiento, simulador interactivo movido a 10x/50x/100x y long/short con matemática verificada — 9.50% de distancia a liquidación a 10x confirmado pixel a pixel —, verificación móvil, barrido de regresión sin errores en 21 rutas)

**Bug encontrado y corregido:** dos íconos emoji (🛗 "elevador" y ⚖ sin selector de variación) no renderizaban correctamente en el entorno de verificación — el primero como glifo faltante, el segundo como un ícono equivocado. Se reemplazaron por 📈 y ⚖️ (con selector de variación), ambos ya verificados en otras partes de la app.

### 9.2 — Escuela de Contratos (Academia Nivel 6) ✅
- [x] Nivel 6 "Contratos y Apalancamiento" en `academyLevels.ts`, marcado AVANZADO (badge rojo), recomienda completar "Gestión de Riesgo" antes vía nuevo campo `recommendedBeforeId` (no asume que sea el nivel inmediatamente anterior)
- [x] 4 temas (enlazan a pestaña Contratos y a Terminal modo Futuros) + quiz de 10 preguntas en `quizzes.ts` (5 de cálculo práctico con explicación paso a paso: efecto de apalancamiento, margen requerido, precio de liquidación, costo de funding, SL vs. liquidación)
- [x] Build limpio + verificación en navegador (probado en vivo: card de nivel con badge AVANZADO y sugerencia correcta de prerrequisito, quiz completo con las 10 respuestas correctas → 100% y mensaje de aprobado, progreso general recalculado a 1/6 niveles, barrido de regresión sin errores en 21 rutas)

**Bug encontrado y corregido:** el subtítulo de la página Academia decía "ruta de aprendizaje de 5 niveles" — quedó desactualizado al agregar el Nivel 6. Se cambió a `${ACADEMY_LEVELS.length} niveles`, calculado dinámicamente para no volver a desactualizarse.

### 9.3 — Modo Futuros en la Terminal ✅
- [x] Toggle SPOT/FUTUROS en la barra del par — `sections/TerminalPage.tsx`
- [x] Botones LONG/SHORT, selector de apalancamiento 1x-50x (aviso >10x con enlace a Contratos), margen aislado por defecto (selector con explicación aislado vs cruzado) — `components/terminal/FuturesOrderPanel.tsx`
- [x] Motor: precio de liquidación mostrado antes de confirmar + línea roja "LIQ" en el gráfico (`TerminalChart` extendido con `extraPriceLines`, sin tocar la ruta spot existente), P&L amplificado por apalancamiento, funding simulado cada 8h con tasa pública de Binance Futures (`lib/binance/futures.ts`, con fallback si falla el fetch), liquidación automática con mensaje educativo — `store/futuresStore.ts`, `lib/futures/`
- [x] Panel de riesgo: margen usado, tamaño real de la posición, pérdida si toca SL, distancia a liquidación, aviso rojo si el SL queda más lejos que la liquidación
- [x] Reglas de feedback de futuros (10 reglas) en `lib/futuresTradeFeedback.ts` — liquidado por apalancamiento excesivo, funding relevante, short/long contra tendencia del Alligator, SL inalcanzable, margen cruzado con pérdida grande, buena disciplina de apalancamiento bajo
- [x] Estadísticas y Diario separan spot y futuros — `FuturesManagementTabs.tsx` (columnas de apalancamiento/margen/liquidación propias) + filtro Todos/Spot/Futuros en el Diario, con badge de apalancamiento y lección automática en liquidaciones
- [x] Build limpio + verificación en navegador (probado en vivo: apertura de LONG a 50x con matemática de margen/tamaño/liquidación verificada pixel a pixel contra la fórmula, aviso de apalancamiento alto, línea LIQ confirmada en el panel de posiciones y en el gráfico, escenario de liquidación automática forzado de forma determinística — balance y P&L correctos, banner "POSICIÓN LIQUIDADA" con feedback de reglas, entrada reflejada en el Diario con filtro por Futuros —, verificación móvil, barrido de regresión sin errores en 21 rutas)

**Bugs encontrados y corregidos durante la verificación:**
1. El banner de feedback de trade cerrado solo se activaba en cierres manuales — un cierre automático (SL, TP o liquidación) nunca lo mostraba, tanto en Futuros (nuevo) como en Spot (gap preexistente del Bloque 1 nunca detectado porque su verificación original solo probó un cierre manual). Se corrigió reemplazando el seteo manual por un watcher sobre el array `history` de cada store, que dispara el banner sin importar la causa del cierre.
2. En una liquidación, `pnl` ya se clampeaba correctamente a `-margen`, pero `pnlPercent` no — podía mostrar un número que contradecía "perdiste el margen completo". Se clampeó `pnlPercent` a `-100%` también en el caso de liquidación.

### 9.4 — Juego "La Liquidación" (Arcade) ✅
- [x] Séptimo juego: 30 días históricos reales (5 semanas × 36 velas de 4h), $500 inicial, elección semanal de dirección + apalancamiento — `components/arcade/games/LaLiquidacion.tsx`
- [x] Línea de liquidación visible en vivo mientras avanzan las velas (recalculada con `lib/futures/liquidation.ts`, misma fórmula que Contratos y la Terminal)
- [x] Resumen final: tu resultado vs mismas decisiones a 3x vs mismas decisiones en spot (1x), con tabla semana por semana
- [x] Logros: "Sobreviviente 30 Días", "Aprendiz de Palanca" (ganar usando solo ≤5x), "Mi Primera Liquidación" — `data/achievements.ts`, nuevos contadores genéricos `flagCount`/`secondaryFlagCount` en `store/arcadeStore.ts`
- [x] XP integrado al sistema de progresión del Arcade (mismo `recordGameResult`, récord en $ como Sobrevive los 20)
- [x] Build limpio + verificación en navegador (probado en vivo: partida completa con LONG a 50x — liquidado con solo -1.08% de movimiento adverso mientras la misma decisión a 3x y en spot sobrevivió casi intacta, demostrando la lección central del bloque —, logros desbloqueados correctamente, barrido de regresión sin errores en 21 rutas)

**Bugs encontrados y corregidos durante la verificación (los más serios de todo el Bloque 9):**
1. El juego se quedaba colgado indefinidamente en la última vela de cada semana. Causa raíz: `finishRound()` (que dispara ~6 `setState` en cascada) se llamaba desde **dentro** del actualizador funcional de `setRevealIndex` — la misma familia de error que "setState durante el render" detectada en el Bloque 9.3, pero más difícil de ver porque no siempre imprime la advertencia de React. Se corrigió separando responsabilidades: el intervalo ahora solo avanza `revealIndex`, y un `useEffect` dedicado dispara `finishRound()` cuando `revealIndex` llega a la última vela — el único lugar seguro para esa cascada de actualizaciones.
2. Bug secundario relacionado: `revealIndex` no se reiniciaba a 0 al pasar de una semana a la siguiente, lo que revelaba todas las velas de la semana siguiente de golpe antes de que el jugador eligiera dirección y apalancamiento — arruinando la sorpresa. Corregido en `nextOrFinish`.
3. Se simplificó una comprobación de liquidación duplicada/redundante (dos ramas `if` que evaluaban la misma condición) detectada durante la revisión del mismo bloque de código.

### Pulido adicional — "Cómo se juega" en el Arcade
- [x] Los 7 juegos ahora muestran una caja "CÓMO SE JUEGA" (pasos concretos) + "QUÉ VAS A APRENDER" (la lección de fondo) antes de la primera ronda — `components/arcade/HowToPlayBox.tsx`, verificado en los 7 juegos sin errores de consola.

## Bloque 10 — Profundización de contenido en páginas existentes

Pedido del usuario: varias páginas ya construidas se sienten pobres o superficiales.
El objetivo es llevarlas a nivel "enseñanza profesional" — mismo estándar de detalle,
ejemplos y honestidad que el resto de la app. Reglas globales, disclaimers y diseño
existente siguen aplicando.

- [x] 10.1 — Radar de Trading: cada herramienta explicada a detalle con ejemplos, sensación de enseñanza profesional. `components/tools/ToolExplainer.tsx` + `data/tradingToolsExplainers.tsx` — 4 secciones por herramienta (Qué mide / Cómo leerlo / Ejemplo concreto / Cuándo usarlo), con los umbrales y fórmulas exactos que usa cada tool (RSI 30/70, percentiles de volatilidad 25/75, ventana de swings de 4 velas, etc. — verificados contra el código real de cada herramienta, no inventados). Verificado en las 5 herramientas sin errores de consola, barrido de regresión limpio.
- [x] 10.2 — Justin Sun: página mucho más completa (orígenes, trayectoria expandida a 14 hitos, relaciones con CZ y Vitalik, arte/NFTs — compra de "Comedian" de Cattelan por $6.2M —, litigio con la SEC y conexión con World Liberty Financial/familia Trump con salvedad explícita por ser tema legal en desarrollo, forma de operar, visión declarada para TRON) — sin fotos reales fabricadas (aviso explícito al usuario de por qué), con iconografía en su lugar. Verificado en navegador sin errores, barrido de regresión limpio.
- [x] 10.3 — Estrategias & Cómo Invertir: 6 estrategias a fondo (DCA, Value Averaging, HODL, Rebalanceo, Toma de ganancias escalonada, Núcleo+Satélite) cada una con cómo funciona, ejemplo numérico concreto, ventajas/desventajas y "para quién es" — `data/strategies.ts` (reemplaza a `data/investors.ts`, ahora eliminado por duplicado). Verificado en navegador sin errores, barrido de regresión limpio.
- [x] 10.4 — Halvings BTC: bloque educativo "qué es el halving y por qué importa" (mecanismo de recompensa/bloque 210,000/shock de oferta), tabla comparativa lado a lado de los 4 halvings (fecha, recompensa, precio, ATH, días al ATH, % de suba vía `gainToAthPercent`, días desde el halving anterior vía `daysBetween` — ambas funciones nuevas y puras en `data/halvings.ts`, sin inventar precios históricos que no existían), y una "calculadora de ciclo" que proyecta 3 fechas ilustrativas para el pico del ciclo actual aplicando los offsets reales (`daysToAth`) de los 3 ciclos completos anteriores a la fecha del halving #4 (2024-04-20) — etiquetada explícitamente como proyección análoga histórica, no predicción. Se mantiene la línea de tiempo y la guía de fase de ciclo existentes. **Bug encontrado y corregido:** el parseo del rango "18+ meses" de la guía de fase de ciclo fallaba silenciosamente (dividía por un guion en, pero el `+` se reemplazaba por un guion normal, y el `.split` buscaba el guion largo — `Number()` daba `NaN` y el `.find()` nunca matcheaba), causando que la fase actual mostrara siempre "Acumulación" sin importar cuántos meses hubieran pasado. Se corrigió con un parser dedicado (`parsePhaseRange`) que maneja el caso `"N+"` como `[N, Infinity]`; verificado que a 835 días post-halving ahora muestra correctamente "Corrección / Invierno". Verificado en navegador sin errores de consola, barrido de regresión limpio en las 22 rutas.
- [x] 10.5 — M2 vs Mercado: agregado `ToolExplainer` (mismo componente reusado de 10.1) explicando qué mide M2 (serie M2SL mensual de la Fed vía FRED), cómo leer el gráfico dual-eje (mirar pendiente de meses, no coincidencia vela a vela — M2 es mensual y se mueve mucho más lento que el precio), ejemplo histórico concreto (expansión de M2 2020–2021 vs. mercado alcista, contracción de M2 2022 —la primera interanual en 60+ años— vs. mercado bajista) y cuándo usarlo/no usarlo (contexto macro de fondo, no señal de timing). Se agregó una caja "LECTURA ACTUAL" dinámica (interpreta el `m2ChangePercent` ya calculado en la página) y una guía rápida de 3 escenarios (M2 acelerando / plana / desacelerando) con la implicación práctica de cada uno. Verificado en navegador sin errores de consola, barrido de regresión limpio en las 22 rutas.
- [x] 10.6 — Stop Loss: nueva sección "0. ¿Qué es un Stop Loss?" (`sections/riskManagement/StopLossExplainer.tsx`) agregada como primer bloque de Gestión de Riesgo, antes de la Calculadora de Tamaño de Posición (el lugar correcto — ambas calculadoras existentes ya pedían un valor de SL como input pero nunca explicaban qué es ni cómo elegirlo). Cubre: definición y mecánica (orden condicional que cierra la posición automáticamente y convierte la pérdida máxima en un número conocido de antemano), dónde colocarlo (nivel estructural — debajo del último fractal/soporte en largo, arriba de la resistencia en corto — con link cruzado a Fractales & Estructura, verificado en navegador que la navegación funciona), cuándo usarlo (siempre, con las únicas excepciones razonadas explicadas), y los dos errores opuestos más comunes (demasiado ajustado = te saca el ruido; demasiado amplio = arriesgás de más) con la corrección de cada uno. Cierra remitiendo a la Calculadora de Tamaño de Posición inmediatamente debajo. Agregado también a la navegación por anclas de la página. Verificado en navegador sin errores de consola (incluyendo click real del link a Fractales), barrido de regresión limpio en las 22 rutas.
- [x] 10.7 — Spider Intelligence remasterizada: pasó de ser una foto estática (4 stat cards sueltas + guía estática) a un motor de señales que interpreta y conecta datos, siguiendo la visión detallada que dio el usuario en el chat, priorizada en el orden que pidió:
  1. **Spider Score** — velocímetro semicircular SVG (`components/spider/SpiderGauge.tsx`) que fusiona 7 señales con el mismo peso cada una (Fear & Greed, distancia al ATH promedio BTC+TRX, RSI 14 diario de BTC y de TRX vía `@spider/indicators`, momentum MACD de BTC y de TRX, tendencia de M2) en un único número 0-100 con veredicto ("Zona de acumulación" / neutral / "Zona de cautela") — `lib/spiderScore.ts` (conteo de votos, mismo método que ya usaba `compositeSignal` del paquete de indicadores, sin caja negra). El desglose completo de las 7 señales con su lectura, voto (▲/▬/▼) y explicación va justo debajo, cada una con link "Profundizar" a la página correspondiente.
  2. **Explicación dinámica generada por reglas** — `lib/spiderNarrative.ts` arma la frase de "por qué está en esta zona" a partir de qué señales concretas votaron cada dirección, y "qué tendría que pasar para cambiar de zona" con los umbrales y valores reales del momento (ej. "el Fear & Greed tendría que subir de 28 a más de 70"). 100% reglas fijas, se recalcula solo con los datos reales, cero IA.
  3. **Comparación histórica ("¿cuándo se vio esto antes?")** — requirió trabajo de backend nuevo: `providers/alternativeMe.ts` ahora expone `fetchFearGreedHistory()` (historial completo público de alternative.me desde feb-2018), nuevo endpoint `GET /api/market/fear-greed-history` cacheado 6h, nuevos tipos `FearGreedHistoryPoint`/`FearGreedHistoryResponse` en `@spider/types`. `lib/spiderHistoricalAnalog.ts` busca la ocurrencia histórica más parecida (misma clasificación, valor más cercano, ≥30 días atrás). `hooks/useHistoricalAnalogOutcome.ts` reutiliza `fetchCachedCandles` (Binance directo desde el navegador + caché IndexedDB, ya construido en el Bloque 9/Arcade) para traer el precio real de BTC en los ~90 días siguientes a esa fecha y mostrar el cambio real de precio. Verificado con datos reales: encontró una ocurrencia real de Fear&Greed=28 y calculó correctamente el cambio de precio de BTC en los días siguientes.
  4. **Termómetro de riesgo de mercado** — `lib/marketRiskThermometer.ts` combina volatilidad diaria promedio de BTC (14 días) + funding rate real de Binance Futures (`useFundingRate`, ya existente desde el Bloque 9) en una lectura bajo/medio/alto con mensaje explicando el sesgo de apalancamiento del mercado, con link directo a Contratos.
  5. **Semáforo por temporalidad** — las grillas existentes de 1h/24h/7d/30d/1a para BTC y TRX ahora muestran un punto de color (verde/dorado/rojo) por umbral, para lectura de un vistazo.
  6. **Botón "Explícame esto"** — conecta cada sección con Spider Chat de verdad: se agregó `draft`/`setDraft` a `store/chatStore.ts`, `ChatWidget.tsx` ahora lee el input desde el store en lugar de estado local, y `components/spider/ExplainButton.tsx` precarga la pregunta y abre el chat. Verificado en navegador: el click precarga el texto exacto en el input y abre el widget.
  7. **Mini-gráfico en vivo con fractales/zonas pintadas** — deliberadamente NO implementado en esta pasada (el propio usuario lo marcó como la pieza de mayor complejidad y menor prioridad, "capas encima" del núcleo). Queda pendiente como posible Bloque futuro si se pide explícitamente.
  Cierra con panel de transparencia "Cómo funciona el Spider Score — sin caja negra" explicando el método exacto. Verificado en navegador: gauge renderiza con la aguja en la posición correcta, las 7 señales muestran datos reales, la comparación histórica trajo una fecha y un cambio de precio reales de Binance, el termómetro de riesgo mostró datos reales de funding, el botón de chat precargó la pregunta correctamente — cero errores de consola. Barrido de regresión limpio en las 22 rutas (el ChatWidget se renderiza globalmente, así que este barrido también confirma que el cambio de `chatStore` no rompió ninguna otra página).

## Bloque 11 — Landing pública, autenticación con Google (Supabase) y páginas legales

**Actualización de la regla de costo cero:** se permite Supabase EXCLUSIVAMENTE en su capa
gratuita (Auth + Postgres). Nada de funciones de pago — si alguna funcionalidad requeriría
plan de pago, se usa la alternativa gratuita en su lugar.

- [x] 11.1 — Landing page pública en `/` (`sections/LandingPage.tsx`), dashboard completo movido a `/app/*` con `DashboardLayout.tsx` (nested routes vía `<Outlet/>`, contiene Nav/MobileTopBar/TickerBar/ChatWidget/OnboardingModal/BackupModal/LegalConsentBanner — antes vivían sueltos en `App.tsx`, ahora correctamente aislados del sitio público para que no aparezcan en la landing/legales). Las 21 rutas planas anteriores (`/academia`, `/terminal`, etc.) redirigen automáticamente a su equivalente `/app/...` vía `LEGACY_DASHBOARD_PATHS` (derivado de `lib/sections.ts`, no hardcodeado dos veces) — verificado que las 21 redirigen exactamente donde corresponde. Se actualizaron todos los enlaces internos que apuntaban a rutas del dashboard (Nav, MobileTopBar, OnboardingModal, FuturesOrderPanel, TerminalPage, OrderPanel, StopLossExplainer, SpiderIntelligencePage) para usar el prefijo `/app`. Secciones de la landing en el orden pedido: Hero (headline + subheadline + 2 CTAs + `DashboardMockPreview` — un mock 100% estático con velas y valores fijos, sin fetch ni websockets, para cumplir "rápida, estática"), Historia del creador (firmada, con link a @Spyde3rAI), Qué incluye (grid de 9 features con badge "100% GRATIS", cada una linkeando a su sección real de `/app`), Cómo funciona en 3 pasos, La cifra honesta, Redes y comunidad (`data/socials.ts` — estructura preparada para agregar Discord/Telegram/YouTube sin tocar componentes), footer compartido (`components/public/PublicFooter.tsx`, reusado también en las páginas legales). Animaciones de entrada al scroll vía `components/public/Reveal.tsx` (IntersectionObserver, sin dependencias nuevas) — verificado con scroll incremental real en Playwright que las secciones llegan a opacity:1 (una captura fullPage inicial mostró un hueco en blanco porque el resize instantáneo de Chromium no le da tiempo al IntersectionObserver a disparar antes de la captura — confirmado que es un artefacto del método de captura, no un bug real, con una segunda verificación que simula scroll incremental). SEO básico completo en `index.html`: title, meta description, canonical, favicon (`public/favicon.svg`, mismo diamante ◈ de la marca), Open Graph completo con imagen (`public/og-image.svg`, 1200×630) y Twitter Card. Build limpio, barrido de regresión con cero errores de consola en las 22 rutas de `/app`, las 4 rutas públicas y las 21 redirects legacy (47 rutas verificadas en total).
- [x] 11.2 — Autenticación con Google vía Supabase (capa gratuita). `lib/supabase.ts` (web) crea el cliente solo si `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` están seteadas (`isSupabaseConfigured`) — sin ellas exporta `null` y toda la UI de cuenta se auto-oculta, verificado en navegador que no aparece ningún botón de login y el resto de la app (incluida la Terminal) sigue funcionando exactamente igual. `store/authStore.ts` (Zustand) envuelve `onAuthStateChange`/`signInWithOAuth`/`signOut`. `components/account/AccountMenu.tsx` en la esquina de la `TickerBar` (avatar de Google + dropdown cuando hay sesión, botón "Iniciar sesión" si no), `LoginModal.tsx` (checkbox de aceptación de Términos/Privacidad obligatorio antes de habilitar "Continuar con Google" — comparte la misma clave de localStorage que el banner de 11.3, así que aceptar en cualquiera de los dos lugares no vuelve a preguntar en el otro), `DeleteAccountModal.tsx` (doble confirmación). Esquema completo en `supabase/schema.sql`: `profiles` (+ trigger que lo crea automáticamente al registrarse), `academy_progress`/`arcade_stats`/`terminal_state`/`settings` (un blob JSONB por usuario), `achievements`/`journal_entries` (fila por ítem, para poder unir sin perder nunca uno), RLS activada en las 6 con policies idénticas `auth.uid() = user_id`, y una función `delete_user_data()` para el borrado de cuenta. Backend: `lib/supabaseAdmin.ts` (cliente con service role, nunca expuesto al navegador) + `verifyUserToken()`; el chat (`routes/chat.ts`) ahora usa `user:<uuid>` como clave de rate limit cuando llega un JWT válido en `Authorization`, y cae a IP si no — reutilizando el mismo `checkChatRateLimit()` genérico que ya existía; nuevo endpoint `POST /api/account/delete` que verifica el JWT, llama al RPC `delete_user_data` y borra la cuenta de `auth.users` con la service role key. `SETUP.md` documenta los 6 pasos manuales (proyecto Supabase, correr `schema.sql`, habilitar proveedor Google, credenciales OAuth en Google Cloud Console, variables de entorno en Netlify — `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` en el frontend, `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` en el backend, nunca commiteadas). **Límite de verificación reconocido de antemano:** sin un proyecto Supabase real (que el dueño debe crear siguiendo `SETUP.md`), el flujo de login con Google en sí no se puede probar de punta a punta en este entorno — lo que sí se verificó exhaustivamente es que build+typecheck están limpios, y que la app entera (las 47 rutas del barrido de regresión) funciona sin ningún error de consola con Supabase completamente sin configurar, que es el estado real del despliegue actual.
- [x] 11.3 — Páginas legales públicas `/terminos`, `/privacidad`, `/riesgo` (`sections/legal/`, compartiendo `components/legal/LegalPageLayout.tsx` con el patrón "EN CORTO" + desarrollo por sección, y `PublicHeader`/`PublicFooter`). Fecha de "última actualización" y nota de "plantilla informativa, no asesoría legal" al pie de las 3, tal como se pidió. Enlazadas desde el footer público (landing + legales entre sí) y desde el dashboard: Contratos ahora tiene un link directo a `/riesgo` junto a su disclaimer, y el aviso de FUTUROS en la Terminal linkea tanto a Contratos como a `/riesgo`. Banner de aceptación no bloqueante en el primer uso del dashboard (`components/legal/LegalConsentBanner.tsx`, gate por localStorage, montado dentro de `DashboardLayout` — no aparece en la landing ni en las legales) — verificado en navegador que aparece en el primer render y desaparece al aceptar. (El checkbox de aceptación en el flujo de login con Google queda para 11.2, ya que depende de que ese flujo exista.) Build limpio, verificado en navegador sin errores de consola.
- [x] 11.4 — Capa única de sincronización en `lib/storage/` — los stores de Zustand (`academyProgressStore`, `arcadeStore`, `diaryStore`, `paperTrading/store`, `futuresStore`, `terminalPreferencesStore`) NO se tocaron por dentro; `lib/storage/cloudSync.ts` los observa desde afuera vía `.subscribe()` (Zustand ya expone esto en el hook), así que ni los componentes ni los propios stores saben que existe la nube — exactamente lo pedido. Dos tipos de dominio (`lib/storage/types.ts`): `BlobSyncTarget` (un documento por usuario, push debounced 2s) y `SetSyncTarget` (filas independientes con id, para unión sin pérdida). `lib/storage/adapters.ts` define los 6 dominios reales, con merge revisado contra el shape real de cada store (no supuesto): `academy_progress` (unión por nivel — `bestScorePercent` con `Math.max`, `completed` con OR, nunca se "desaprueba" un nivel), `achievements` (unión de ids, tabla fila-por-logro), `arcade_stats` (blob, gana el más reciente), `terminal_state` (spot+futures combinados; `history` de cada uno se une por id de trade — un trade cerrado nunca desaparece — balance/posiciones/órdenes abiertas ganan el lado más reciente), `journal_entries` (unión por id de entrada), `settings` (preferencias de indicadores de la Terminal, gana el más reciente). "Más reciente" se resuelve con `lib/storage/localMeta.ts` (timestamp local persistido en localStorage, actualizado cada vez que el store correspondiente cambia) comparado contra el `updated_at` que Postgres devuelve — no es una suposición, es una comparación real de timestamps. `hooks/useCloudSync.ts` (montado una vez en `DashboardLayout`) dispara `startCloudSync()` al detectar sesión iniciada (pull remoto → merge → aplica local → vuelve a subir el resultado — así la primera vez que alguien inicia sesión, su progreso local existente sube a la nube sin perder nada) y `stopCloudSync()` al cerrar sesión. El export/import JSON del Bloque 8 (`lib/backup.ts`) sigue existiendo tal cual y convive con la nube — de paso se corrigió un bug real preexistente: `BACKUP_KEYS` no incluía `spider-futures-trading`, así que el historial de futuros nunca se incluía en los respaldos exportados; corregido, junto con la clave de aceptación legal. El menú de ajustes (`BackupModal.tsx`) y el menú de cuenta (`AccountMenu.tsx`) muestran el estado de sincronización ("Guardado en este dispositivo" / "Sincronizado en la nube como nombre@gmail", con indicador de color) — verificado en navegador que aparece correctamente en modo local-first. Build y typecheck limpios en los 4 paquetes del monorepo. **Verificación final del flujo completo (anónimo → login → sync → otro dispositivo → eliminar cuenta) queda pendiente de ejecutar en vivo hasta que el dueño complete `SETUP.md`** — la lógica de merge fue revisada campo por campo contra el código real de cada store en vez de asumirlo, precisamente para minimizar el riesgo de pérdida de datos el día que sí se pruebe con credenciales reales.

**Nota de alcance:** 11.2 y partes de 11.4 dependen de que el dueño del proyecto complete la
configuración manual externa (crear el proyecto Supabase, habilitar OAuth de Google) descrita
en `SETUP.md` — sin esas claves reales en las variables de entorno, el código de auth queda
implementado y buildeando limpio, pero el login en vivo no se puede verificar end-to-end hasta
que esas claves existan. La app debe seguir funcionando 100% en modo local mientras tanto.

## Correcciones reportadas en producción (post-Bloque 11)

- [x] **Fractales en vivo fallaban (y en realidad, cualquier gráfico que pasara por `/api/klines`).** Diagnóstico confirmado con curls directos contra la producción: Binance/Bybit devuelven error desde las IPs de Netlify (bloqueo geo/datacenter documentado desde bloques anteriores) y la clave de `CRYPTOCOMPARE_API_KEY` configurada en Netlify ya superó su cuota gratuita mensual (257/100 llamadas) — con los 3 proveedores del servidor caídos a la vez, `/api/klines` devolvía 502 para CUALQUIER símbolo/timeframe, no solo para Fractales (afectaba también a Análisis Técnico, Radar de Trading, el simulador de liquidación de Contratos, y las señales RSI/MACD de Spider Intelligence). Corregido en la raíz: `lib/api.ts`'s `fetchKlines()` ahora intenta primero el endpoint del servidor y, si falla, cae a pedir las velas directo a Binance desde el propio navegador del visitante (reutilizando `fetchBinanceKlines` de `lib/binance/rest.ts`, el mismo truco que ya usaban la Terminal y el Arcade para evitar el bloqueo por IP de nube) — arregla todos los consumidores de `useKlines` de una sola vez, no solo Fractales. Build y typecheck limpios, barrido de regresión limpio en las 47 rutas.
- [x] **Contratos: quitada la etiqueta "COMO SI TUVIERAS 5 AÑOS"** de las 7 tarjetas de concepto (`components/contracts/ConceptCard.tsx`) por pedido explícito del usuario — no se veía profesional. Reemplazada por "LA IDEA EN SIMPLE", mismo estilo mono-uppercase que las otras dos columnas ("AHORA EN SERIO" / "LOS NÚMEROS"). El contenido de las analogías en sí (manzana, ascensor, patines, piso es lava, etc.) se mantuvo intacto — el pedido era sobre la etiqueta, no sobre el contenido pedagógico. Verificado en navegador que la frase vieja ya no aparece en ningún lado.
- [x] **Fear & Greed verificado end-to-end contra producción** — dato real y en vivo confirmado por partida doble: `curl` directo al endpoint de producción (`value:28, classification:"fear"`) y lectura del texto renderizado en la página en vivo (idéntico). El motivo por el que podía sentirse "poco confiable" no era un bug de Fear & Greed en sí, sino que compartía panel con las señales de RSI/MACD que sí estaban rotas por el apagón de `/api/klines` descripto arriba — con el fallback a Binance desde el navegador, esas señales vecinas vuelven a mostrar datos reales y la desconfianza en el panel completo debería desaparecer. No se encontró ninguna inconsistencia en los umbrales de voto (≤25 miedo extremo / ≥75 codicia extrema) ni en el mapeo de clasificación — de paso se detectó que `lib/signalEngine.ts` (el motor de zona viejo, pre-remaster) quedó como código muerto sin ningún import — no se tocó por no ser parte de lo reportado, pero queda anotado para una futura limpieza.

## Remaster de Bitcoin, TRON y Stablecoins TRON con datos reales en vivo

Pedido del usuario: las tres páginas se sentían simples — agregar tablas y datos reales en
vivo (no inventados), tomados de APIs públicas, tantos como fuera razonable.

- [x] **Bitcoin** — nueva fuente de datos on-chain real: `providers/mempool.ts` + `GET /api/bitcoin/stats` contra la API pública de mempool.space (gratis, sin key) trayendo en paralelo altura de bloque, hashrate (EH/s), dificultad, fees recomendados (sat/vB en 4 niveles), estado de la mempool (tx pendientes, tamaño, fees totales) y progreso hacia el próximo ajuste de dificultad (con fecha estimada). Nuevo tipo `BitcoinStatsResponse` en `@spider/types` + fallback estático si mempool.space no responde. La página ahora explica qué significa cada métrica (por qué importa el hashrate para la seguridad de la red, qué es la mempool y por qué suben las comisiones) en vez de solo mostrar números sueltos.
- [x] **TRON** — se sacó la tarjeta de "TVL" que SIEMPRE mostraba $0.00 (el campo nunca lo entrega TronScan, era un dato falso disfrazado de real — el tipo de cosa que el usuario pidió evitar explícitamente). La grilla de métricas sueltas se convirtió en una tabla real (Métrica / Valor / Qué significa) con una fila derivada nueva ("Bloques/día estimados", calculada a partir del block time real de TRON, etiquetada explícitamente como derivada y no como dato de la API).
- [x] **Stablecoins TRON** — la página más pedida en detalle. Agregado: tabla de ranking completa (posición, supply, holders, % del total, promedio por holder — todo calculado en vivo desde `/api/market/stablecoins`), barras de participación de mercado por stablecoin, y 5 tarjetas "qué respalda a cada stablecoin y su riesgo real" (`data/stablecoinInfo.ts` — emisor, tipo de respaldo, riesgo concreto de cada una, incluyendo la capacidad de Tether/Circle de congelar direcciones y el de-peg de USDD en 2022) más una sección que cruza el supply de stablecoins con las métricas de red de TRON (cuentas activas, transacciones, TPS) para explicar la relación. Se mantuvo el gráfico histórico de crecimiento de USDT.
  **Bug encontrado y corregido durante la verificación:** el gráfico de barras de crecimiento trimestral tenía una altura calculada con `%` dentro de un contenedor flex con `items-end` — como ese contenedor no le da una altura definida a sus hijos (solo los alinea al fondo), el porcentaje de altura de cada barra no tenía contra qué resolverse y las barras colapsaban casi a cero (se veían como líneas finitas, no barras). Corregido envolviendo cada barra en un track intermedio con `flex-1` dentro de una columna de altura fija (`h-40`), que sí le da un alto definido al `%`. Verificado midiendo la altura real en píxeles de cada barra en el navegador (crecen de 65px a 115px seguiendo la curva real de supply) y con una captura de pantalla.
  Build y typecheck limpios, barrido de regresión limpio en las 47 rutas.

**Nota:** trabajo pendiente de push/deploy por instrucción explícita del usuario ("todavía no
hagas deploy") — queda commiteado localmente cuando corresponda, no enviado a producción hasta
que se pida.

## Bloque 12 — Academia completa: de índice de quizzes a curso real (REEMPLAZA el Bloque 4 anterior)

Pedido del usuario, verbatim en estructura: 10 niveles, cada uno con 3-6 LECCIONES reales (teoría +
ejemplos + ejercicios interactivos calificados por reglas) antes del quiz final. Contenido como datos
en `src/content/academy/` separado de la UI. Ejercicios de 9 tipos distintos, incluyendo retos que se
verifican contra el estado real de la Terminal/Arcade. Ruta visual de 10 niveles, progreso por lección
(no solo por nivel), XP/insignias compartidas con el Arcade. Cero IA en la calificación — todo reglas.
Costo cero, mismo sistema visual, español, disclaimers NFA.

Dado el tamaño (10 niveles × 3-6 lecciones × contenido real + 9 tipos de ejercicio + integración con
Terminal/Arcade + rediseño completo de la UI de Academia), se construye en este orden:

- [x] 12.1 — Arquitectura base construida completa: `content/academy/types.ts` (13 tipos de bloque +
      9 tipos de ejercicio, todo tipado), `components/academy/LessonRenderer.tsx` (recorre los bloques
      de una lección, trackea qué ejercicios están resueltos, barra de progreso, botón "marcar como
      leída" para lecciones sin ejercicios), un componente por tipo de bloque en `components/academy/
      blocks/` (Destacado, Analogia, Lista, Tabla, Conecta, GraficoEjemplo — vela real vía `useKlines`
      + `layoutCandles`, DiagramaSVG — registro de diagramas reutilizables, empezando con
      `CadenaDeBloques` y `CustodiaWallet`), y los 9 componentes de ejercicio en `components/academy/
      exercises/` (OpcionMultiple, VerdaderoFalso, Ordenar — reordenar con botones ▲▼ en vez de
      drag-and-drop nativo por confiabilidad, Emparejar — click-to-match, MarcaGrafico — reutiliza
      `detectFractals`+`layoutCandles` sobre velas reales de Binance y valida el click contra los
      fractales detectados de verdad, CompletaEspacio, CalculadoraGuiada, RetoTerminal, RetoArcade).
      Todos calificados 100% por reglas (comparación directa, sin IA), con feedback inmediato, y
      exigen una respuesta CORRECTA (no solo un intento) para marcarse como resueltos — permiten
      reintentar sin penalidad.
- [x] 12.2 — Progreso granular por lección: `academyProgressStore` ahora guarda `lessonsCompleted:
      string[]` por nivel además de `bestScorePercent`/`completed` del quiz (con `merge` en el
      `persist` de Zustand para no romper saves viejos sin ese campo). `lib/academy/challenges.ts` —
      6 retos reales verificables por reglas contra `paperTradingStore`/`futuresStore`/`arcadeStore`
      (abrir posición con SL ≤2% de riesgo, cerrar un trade en ganancia, racha de 10 en "Sube o Baja",
      sobrevivir "Sobrevive los 20" con bajo riesgo, abrir futuros, jugar "La Liquidación") vía
      `useChallengeCompletion` (se suscribe a los 3 stores y re-evalúa en cada cambio) — sin bloqueo
      duro, el usuario puede seguir navegando la app igual. La capa de sincronización en la nube del
      Bloque 11 se actualizó (`lib/storage/adapters.ts`) para unir `lessonsCompleted` por id (nunca se
      pierde una lección completada al sincronizar entre dispositivos).
- [x] 12.3 — Nivel 1 "Fundamentos de cripto" completo end-to-end (`content/academy/nivel-01-
      fundamentos.ts`): 6 lecciones reales (qué es el dinero y por qué existe Bitcoin, blockchain
      explicada simple, qué es Bitcoin, qué es TRON, cómo leer un precio, exchanges/wallets/custodia/
      seguridad), con teoría desarrollada, 2 diagramas SVG, ejemplos, y ejercicios de 6 tipos distintos
      distribuidos entre las lecciones (opción múltiple, verdadero/falso, completar espacio, emparejar,
      calculadora guiada, ordenar). Quiz final de 11 preguntas (se reutilizaron y verificaron las 8
      preguntas ya existentes de la implementación anterior, más 3 nuevas cubriendo blockchain/custodia
      que no estaban cubiertas antes). Probado exhaustivamente en navegador: las 6 lecciones, los 6
      tipos de ejercicio uno por uno con clicks reales, y el quiz — todo funcionando.
      **Bug real encontrado y corregido durante la verificación:** `LessonRenderer` llamaba a
      `onComplete()` (que dispara un `set()` de Zustand en `academyProgressStore`) desde DENTRO del
      actualizador funcional de `setSolved` — exactamente el mismo antipatrón de "setState durante la
      actualización de otro componente" ya diagnosticado y corregido en `LaLiquidacion.tsx` en el
      Bloque 9, esta vez confirmado por un warning real de React en consola ("Cannot update a component
      (`Nav`) while rendering a different component (`LessonRenderer`)") capturado durante la
      verificación automatizada. Corregido separando el cálculo puro del set de ejercicios resueltos
      de la llamada a `onComplete()`, que ahora vive en un `useEffect` que reacciona al resultado —
      verificado que el warning desaparece por completo tras el fix.
- [x] 12.4 — Rediseño de la UI de Academia: `AcademyPage.tsx` (nueva) es la ruta/mapa de los 10
      niveles — cada card muestra dificultad, estado (aprobado/próximamente), barra de progreso de
      lecciones y mejor puntaje del quiz; los niveles sin contenido todavía se ven pero están marcados
      "PRÓXIMAMENTE" y no son clickeables. `AcademyLevelPage.tsx` (nueva, ruta `/app/academia/:levelId`)
      muestra la lista de lecciones con checkmarks, el detalle de una lección (reusa `LessonRenderer`,
      con navegación "siguiente lección"), y el quiz final (reusa el componente `Quiz` existente del
      Bloque 4 sin cambios). Progreso general de la cabecera y racha de días se mantienen.
- [ ] 12.5 — Niveles 2-10 (Leer el gráfico, Patrones de velas, Indicadores, Estructura y fractales,
      Gestión de riesgo, Psicología, Contratos y apalancamiento, On-chain y fundamentos, Estrategias
      completas y tu plan) — mismo estándar de profundidad y verificación que el Nivel 1, uno por uno.
      Los 9 niveles ya existen como entradas de metadata reales en `content/academy/levels.ts`
      (título, descripción, dificultad, ícono, orden) — solo falta escribirles `lessons`/`quiz`.
- [ ] 12.6 — Insignias nuevas de Academia integradas a `data/achievements.ts`, pantalla de "Academia
      completada" al aprobar los 10 niveles, verificación final de todo el flujo.

**Nota de alcance:** por el tamaño del pedido, se priorizó dejar el Nivel 1 completo y 100% funcional
como base sólida y verificada antes de replicar el patrón en los 9 niveles restantes, en vez de dejar
los 10 niveles a medio construir simultáneamente.

## Correcciones reportadas en producción (post-Bloque 12)

- [x] **Bug real de datos: Stablecoins TRON mostraba supply global mal etiquetado como supply de
      TRON.** El usuario lo detectó comparando contra tronscan.org directamente (USDT mostraba
      $183.29B en la app vs $90.28B reales en TronScan — casi exactamente el doble). Causa raíz
      confirmada: cuando TronScan fallaba temporalmente, `/api/market/stablecoins` caía a un
      fallback de CoinGecko que devuelve el `circulating_supply` GLOBAL de cada stablecoin (todas
      las cadenas combinadas — Ethereum, Solana, etc.), no el supply específico de TRON. Para USDC
      la distorsión era mucho peor (~$72B global mostrado vs ~$27M real en TRON, un factor de
      ~2600x) porque casi todo el USDC circula fuera de TRON. Corregido eliminando por completo el
      fallback de CoinGecko para este endpoint (`fetchCoinGeckoStablecoinSupply` removida de
      `providers/coingecko.ts` por no poder responder la pregunta correcta) — ahora, si TronScan
      falla, cae directo al dataset estático de referencia (`STABLECOIN_STATIC_FALLBACK`, ya
      etiquetado `live:false` en la UI), que al menos es conceptualmente supply-de-TRON. Verificado
      contra la API en vivo que el supply de USDT ahora coincide con TronScan ($90.28B) y que
      `holders` ya no aparece como "—".
- [x] **Gráficas agregadas donde había datos reales para respaldarlas** (pedido: "se ve mas
      profecional"). Fear & Greed en Spider Intelligence ahora tiene un gráfico de área de los
      últimos 120 días (reutiliza `useFearGreedHistory`, ya construido en el Bloque 11, y el
      componente `PriceLineChart` de lightweight-charts ya usado en Bitcoin/TRON). Bitcoin ganó un
      gráfico de hashrate del último año — requirió extender `providers/mempool.ts` para traer
      `/api/v1/mining/hashrate/1y` (histórico diario real, gratis, sin key) además del snapshot
      actual que ya se usaba; nuevo campo `hashrateHistory` en `BitcoinStatsResponse`. No se agregó
      gráfica en TRON ni en la tabla de stablecoins porque esos endpoints solo devuelven snapshots
      actuales, no series históricas — agregar una ahí requeriría fabricar datos, así que se dejó
      así deliberadamente en vez de inventar una tendencia falsa.
- [x] **Español mexicano:** corregido "aplicás vos mismo" → "aplicas tú mismo" y "completá" →
      "completa" en el párrafo principal y las cards de Academia (`AcademyPage.tsx`), que era el
      lugar específico donde el usuario lo encontró. **Nota importante:** el usuario aclaró ser
      mexicano y necesitar español mexicano (tuteo) en toda la plataforma — el resto de la app se
      había escrito originalmente en español rioplatense (voseo: vos/tenés/podés/sos) a lo largo de
      bloques anteriores de esta sesión. Se guardó como memoria permanente para que todo el
      contenido nuevo use tuteo desde ahora.
- [x] **Conversión completa de voseo → tuteo en toda la app** (pedido explícito del usuario:
      "Convertir todo ahora"). Barrido exhaustivo e iterativo sobre `apps/web/src` (componentes,
      secciones, contenido de Academia, quizzes, estrategias, glosario, logros del Arcade, páginas
      legales) y sobre `apps/api/src` — incluyendo el **system prompt de Spider Chat**
      (`providers/xai.ts`), que también estaba en voseo y regía el tono real de las respuestas en
      vivo del asistente, no solo texto estático de la UI. Cubre formas imperativas (Calculá →
      Calcula, Ordená → Ordena, Mirá → Mira, Elegí → Elige, etc.), pronombre "vos" y conjugaciones
      (tenés/podés/sos/querés), y normalización de "acá" → "aquí" y "plata" → "dinero" donde
      aparecían junto al resto del texto convertido. El descubrimiento por regex tuvo varias rondas
      — el `grep` de Git Bash resultó no ser confiable con límites de palabra (`\b`) sobre vocales
      acentuadas en UTF-8, así que la convergencia final se verificó con el `Grep` (ripgrep,
      Unicode-aware) más lectura directa de archivos. Verificado: `pnpm run typecheck` y
      `pnpm run build` limpios en los 4 paquetes; recorrido con Playwright por Academia (incluida
      una lección completa nivel 1 con sus ejercicios interactivos), Contratos, Gestión de Riesgo,
      Arcade, Terminal, Diario y las 3 páginas legales — cero coincidencias de voseo en el texto
      renderizado y cero errores de consola en ninguna ruta.

Build y typecheck limpios en los 4 paquetes, barrido de regresión limpio en las 47 rutas.

## Bloque 13 — Nivel institucional: order flow, backtester, macro y psicología de trading

Pedido del usuario: llevar la plataforma de "excelente herramienta educativa" a "nivel avanzado
que provoque respeto" — microestructura de mercado, backtesting sistemático, correlación
intermercado y un diario con psicología basada en datos reales. Único punto de fricción con la
regla de costo cero: un "mapa de liquidaciones agregadas" estilo CoinGlass no existe como dato
público gratuito en ningún exchange — el usuario, consultado directamente, eligió reemplazarlo
por un panel de "zonas de apalancamiento estimadas" etiquetado explícitamente como
modelo/estimación, nunca como dato real agregado.

- [x] 13.1 — VWAP expuesto como toggle en la Terminal (el cálculo ya existe en `@spider/indicators`, solo falta el wiring). `useTerminalIndicators.ts` (nuevo toggle `vwap`, computa `vwapValues` con la función `vwap()` ya existente), `IndicatorTogglesPanel.tsx` (fila nueva "Σ VWAP"), `TerminalChart.tsx` (línea nueva color `#ff8ad8`, mismo patrón `addLine` que EMA). Build y typecheck limpios en los 4 paquetes; verificado en navegador que el botón togglea a estado activo sin errores de consola.
- [x] 13.2 — Psicólogo de trading con IA en el Diario (reglas calculan racha de pérdidas y día/horario post-pérdida → la IA solo narra esas cifras verificadas, mismo patrón anti-fabricación que el chat principal). `lib/diary/behavioralStats.ts` (nuevo: `winRateAfterLosingStreak`, `strongestLosingStreakPattern`, `winRateByDayAndSessionAfterLoss`, ambos con guard `MIN_SAMPLE=3`), `DiaryAiAnalysis.tsx` pasa el bloque como `context.estadisticasVerificadas` a `postChat`, `xai.ts` gana una regla no-negociable equivalente a la de datos de mercado pero para estadísticas de comportamiento. Build y typecheck limpios. Verificado con datos sembrados deterministas (secuencia de resultados diseñada a mano): el bloque capturado en la request real a `/api/chat` coincidió cifra por cifra con el cálculo manual (racha de 2+ pérdidas → 67% de acierto después vs. 22% base, muestra 3; bucket Martes/Tarde → 33% en 6 operaciones), cero errores de consola.
- [x] 13.3 — Volume Profile (VPVR) con Point of Control, overlay en canvas sobre el rango visible del gráfico. `packages/indicators/src/volumeProfile.ts` (nuevo, bucketiza volumen por solapamiento de rango de vela, POC + value area 70%), `VolumeProfileOverlay.tsx` (canvas absoluto, recalcula solo con `subscribeVisibleLogicalRangeChange` — primera vez que se usa esa API en el proyecto), toggle wireado igual que VWAP. Build y typecheck limpios. Verificado visualmente en navegador: barras verdes translúcidas con la barra dorada del POC bien ubicadas al borde derecho del gráfico sin tapar el eje de precio, aparecen y desaparecen limpiamente al togglear, cero errores de consola.
- [x] 13.4 — Profundidad real del order book ampliada (snapshot REST + WS fusionados, heatmap de tamaño acumulado — sin lenguaje sensacionalista). `lib/binance/depth.ts` (nuevo, snapshot REST `GET /api/v3/depth?limit=1000` directo desde el navegador), `useOrderBookDepth.ts` (poll cada 5s fusionado con el WS top-of-book), `DepthHeatmap.tsx` (canvas con intensidad de color por tamaño acumulado, banda ±3% del precio medio), `OrderBookPanel.tsx` gana un toggle Lista/Mapa sin perder la lista rápida existente. Build y typecheck limpios. Verificado visualmente con datos reales: barras verdes/rojas por intensidad, etiquetas de precio mín/medio/máx correctas, disclaimer honesto visible ("Profundidad real del order book de Binance..."), cero errores de consola.
- [x] 13.5 — Zonas de apalancamiento estimadas en Contratos (reemplaza el mapa de liquidaciones agregadas, mismo cálculo del Simulador existente, etiquetado como modelo). `lib/futures/leverageZones.ts` (nuevo, reutiliza `computeLiquidationPrice` ya existente sobre tiers 5x/10x/25x/50x/100x, long y short), `LeverageZonesPanel.tsx` (nuevo, badge "ESTIMACIÓN / MODELO" + disclaimer explícito, montado en Contratos justo después del Simulador de Liquidación). Build y typecheck limpios. Verificado visualmente: la distancia a 10x (9.50%) coincide exactamente con la que ya muestra el Simulador de Liquidación existente, badge y disclaimer visibles, cero errores de consola.
- [x] 13.6 — Backtester sin código ("la joya de la corona"): constructor de reglas, paginación de velas históricas, motor headless en Web Worker, métricas (Profit Factor, Win Rate, Max Drawdown, Expectancy). Modelo de datos en `packages/types/src/backtest.ts` (condiciones con 5 indicadores: RSI/EMA/histograma MACD/VWAP/precio, combinadas con AND), `lib/backtest/conditions.ts` (evalúa `gt`/`lt`/`crosses_above`/`crosses_below` calculando solo los indicadores que las reglas realmente usan), `lib/binance/paginatedKlines.ts` (pagina hacia atrás en bloques de 1000 velas con dedupe y límite de seguridad), `lib/backtest/candleCache.ts` (mismo esquema de caché IndexedDB que `historicalCandles.ts`), `lib/backtest/engine.ts` (motor headless adaptado de `replayStore.ts`/`replay/engine.ts`, sizing por riesgo — el SL siempre cuesta exactamente `riskPercent`% del balance), `lib/backtest/metrics.ts`, `workers/backtest.worker.ts` + `useBacktestWorker.ts` (mismo patrón Comlink que `indicators.worker.ts`), `BacktesterPage.tsx` (constructor de condiciones, panel de resultados, curva de equity con `PriceLineChart`, tabla de trades) en `/app/backtester`. Build y typecheck limpios. **Verificado extremo a extremo con datos reales de Binance:** corrida rápida (BTC 1d, 1 año) dio 5 trades cuya matemática se verificó a mano cifra por cifra — Profit Factor 194.06/395.98=0.49 ✓, Expectancy 0.2×194.06−0.8×98.995=-$40.38 ✓, balance final 10000−201.92=$9,798 ✓; corrida paginada (BTC 4h, 2 años, ~4,380 velas en múltiples páginas) completó en segundos con 51 trades y métricas internamente consistentes, confirmando que la paginación deduplica y encadena correctamente. Cero errores de consola en ambas corridas.
- [x] 13.7 — Análisis Macro: correlación BTC/TRX vs DXY, Fed Funds y S&P500 vía FRED (oro descartado — series discontinuadas `GOLDAMGBD228NLBM`/`GOLDPMGBD228NLBM` devuelven 404, verificado con curl en vivo antes de comprometer alcance; DXY `DTWEXBGS` y Fed Funds `FEDFUNDS` con historia completa, S&P500 `SP500` limitado a partir de 2016-08-04 por licencia de FRED, no un bug). `providers/fred.ts` generalizado a `fetchFredSeries(seriesId)` (con `fetchM2Series` como wrapper, sin romper el endpoint existente), 3 endpoints nuevos `/api/market/{dxy,fedfunds,sp500}` con el mismo patrón cache+fallback estático que M2, `packages/types/src/market.ts` gana `MacroSeriesResponse` genérico. `M2VsMercadoPage.tsx` reemplazada por `MacroAnalysisPage.tsx` en `/app/analisis-macro` (redirect legacy desde `/app/m2-vs-mercado`), agregando 3 secciones nuevas con `DualAxisChart` (ya soportaba series arbitrarias) para DXY/Fed Funds/S&P500 junto a la sección de M2 existente. Build y typecheck limpios. Verificado en vivo: los 3 endpoints nuevos devuelven 200 con datos reales de FRED, la página muestra las 4 series con badge "EN VIVO · fred", el redirect de la ruta legacy funciona, cero errores de consola.
- [x] 13.8 — Replay multi-activo sincronizado (dos gráficos, mismo rango visible y crosshair). `useSyncedCharts.ts` (nuevo — primera vez que se usan `subscribeVisibleLogicalRangeChange`/`setCrosshairPosition` de lightweight-charts v4 en el proyecto; el crosshair sincroniza buscando el precio propio del gráfico destino en el mismo instante de tiempo, no el precio del origen, para que cada eje de precio se mantenga correcto), `SecondaryReplayChart.tsx` (chart de solo lectura, sin overlays/panel de orden), `TerminalChart.tsx` gana `onChartReady` opcional para exponer su instancia. Wireado en `ReplayTerminal.tsx` con un toggle "⇄ Comparar con {el otro par}" (BTC↔TRX), trayendo el histórico del par secundario para el mismo rango con `fetchCachedCandles` ya existente. Build y typecheck limpios. Verificado en navegador: al hacer zoom con la rueda del mouse sobre el gráfico principal, el gráfico secundario refleja exactamente el mismo rango de tiempo y la misma posición de crosshair (línea vertical idéntica en ambos), cero errores de consola.
- [x] 13.9 — Pulido: sonido de ejecución de orden (opt-in) + reordenar paneles de la Terminal. `lib/sound.ts` gana `playOrderFillSound()` (carillón de dos notas ascendente, timbre distinto del click global existente), `terminalPreferencesStore.ts` gana `orderSoundEnabled` (default `false`) y `panelOrder`/`movePanel` para el reordenamiento del panel derecho (Orden/Order Book/Trades) con botones ▲▼ — sin drag-and-drop, mismo criterio que el ejercicio "Ordenar" de Academia. El sonido se dispara desde `paperTrading/store.ts` y `futuresStore.ts` en `openMarketPosition` (cubre tanto órdenes de mercado como límites recién llenadas), leyendo la preferencia con `getState()` al ser stores no-React. Build y typecheck limpios. Verificado en navegador: el botón de sonido arranca en 🔇 por defecto, reordenar paneles con ▲▼ funciona y persiste tras recargar, colocar una orden con el sonido activado no genera errores de consola.

Build y typecheck limpios en los 4 paquetes. Los 9 sub-bloques verificados individualmente en navegador
con datos reales — sin push/deploy hasta que se pida explícitamente.

Plan detallado en `C:\Users\Emmanuel\.claude\plans\partitioned-wishing-panda.md`.

## Remaster de Contratos, Stablecoins TRON, TRON Roadmap, Calculadora y Glosario

Pedido del usuario: Contratos se sentía "puro texto" sin nada visual llamativo; Stablecoins TRON
tenía datos mal (a verificar solo contra TronScan, nunca inventados); TRON Roadmap muy simple;
Calculadora necesitaba más funciones; Glosario necesitaba más términos.

- [x] **Contratos** — el Simulador de Liquidación (ya interactivo) y el panel de Zonas de
      Apalancamiento se movieron al principio de la página, antes de las 7 tarjetas de texto, y
      el Simulador ganó un velocímetro de riesgo (`SpiderGauge`, reutilizado de Spider
      Intelligence) que responde en vivo al slider de apalancamiento — SEGURO/MODERADO/
      PELIGROSO/EXTREMO según qué tan cerca está la liquidación del ruido diario normal de BTC.
      Verificado en navegador: el gauge es lo primero que se ve al entrar a la página.
- [x] **Stablecoins TRON — bug real de datos encontrado y corregido.** El contrato de USDD
      configurado (`TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn`) resultó ser una versión abandonada
      (TronScan la etiqueta "USDDOLD") con ~$7M de supply — el contrato real y activo, verificado
      de forma cruzada contra la API de CoinGecko (`TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz`), tiene
      ~$1.28B de supply — un factor de ~181x de diferencia. USDT/USDC/TUSD/USDJ se verificaron
      contra CoinGecko también y ya apuntaban al contrato correcto. Además, `/api/market/
      stablecoins` pedía las 5 monedas con `Promise.all` (5 requests en paralelo contra un límite
      público de TronScan de 3 req/s) y si UNA fallaba por rate-limit, las 5 caían a datos
      estáticos aunque las otras 4 hubieran funcionado — corregido a fetch secuencial con
      fallback por símbolo individual, nunca todo-o-nada. Verificado en vivo contra la API real:
      `source:"tronscan"`, `live:true`, USDD ahora en $1.28B (antes ~$7M), badge "EN VIVO ·
      tronscan" visible en la página.
- [x] **TRON Roadmap** — expandido de 3 líneas por fase a un explicador completo: qué es un
      roadmap y cómo leerlo (con la salvedad honesta de que las fases 1-4 son verificables
      on-chain, la 5 parcialmente y la 6 es solo visión declarada), el lema original de cada fase
      del whitepaper, una sección "por qué importó" por fase, y de 3 a 4 hitos por fase en vez de
      3 genéricos — incluyendo la corrección de que la adquisición de BitTorrent fue en 2018
      (fase Exodus), no en 2020-2021 como decía el dato anterior.
- [x] **Calculadora** — de 2 a 8 herramientas en pestañas: Convertidor y Escenario de precio
      (ya existían) más Tamaño de posición, Ratio Riesgo/Beneficio, Precio de liquidación, P&L de
      un trade, Precio promedio de compra (DCA) y Recuperación de drawdown — todas reutilizando
      funciones puras ya existentes en el proyecto (`riskMath.ts`, `paperTrading/engine.ts`,
      `futures/liquidation.ts`), cero lógica nueva duplicada. Verificado a mano cifra por cifra en
      las 6 herramientas nuevas (todas correctas) y que el resultado de Liquidación coincide
      exacto con el de Contratos ($57,015 / 9.50% a 10x).
- [x] **Glosario** — de 70 a 99 términos: 3 categorías nuevas (Contratos y apalancamiento,
      Indicadores avanzados, Análisis macro) cubriendo términos que la app ya enseña en otras
      páginas pero que faltaban aquí (Funding Rate, Margen aislado/cruzado, MACD, Bandas de
      Bollinger, ATR, ADX, VWAP, Volume Profile/POC, DXY, M2, Correlación, Backtesting,
      Expectancy, etc.). De paso, corregido "explicados en criollo" (modismo rioplatense) a
      "explicados de forma simple y directa".

Build y typecheck limpios en los 4 paquetes. Verificación en navegador de las 5 páginas sin
errores de consola. Sin push/deploy hasta que se pida explícitamente.

## Nivel 6 de Academia — "Unidades, medidas y costos: cómo se mide de verdad tu riesgo"

Pedido del usuario: primera lección real del Nivel 6 (Gestión de Riesgo, antes "PRÓXIMAMENTE"
sin contenido) — 7 conceptos que sí se usan en cripto (tick, spread, tamaño de posición, ATR,
slippage, comisiones maker/taker, valor por movimiento), con los pips mencionados solo como
contexto breve de Forex, nunca como protagonistas.

- [x] Contenido completo en `content/academy/nivel-06-gestion-de-riesgo.ts`: apertura +
      caja "¿Y los pips?" (3-4 líneas, deja explícito que es de Forex y que el equivalente cripto
      es el tick) + 8 secciones (tick, las 3 formas de medir el SL, tamaño de posición/lote/
      tamaño de contrato, valor por movimiento, ATR, spread, slippage, comisiones maker/taker) +
      resumen + conecta a la Terminal. Reemplaza el `stub(...)` de "gestion-de-riesgo" en
      `content/academy/levels.ts` — el nivel deja de mostrar "PRÓXIMAMENTE".
- [x] 2 diagramas SVG nuevos registrados en `blocks/DiagramaSVG.tsx`: `EscalonesTick.tsx`
      (precio subiendo escalón por escalón) y `RuidoVsATR.tsx` (mismo trade, stop dentro del
      ruido que te saca por nada vs. stop fuera del ruido según 1.5× ATR que sobrevive).
- [x] 8 ejercicios calificados por reglas (sin IA): verdadero/falso sobre pip-vs-tick,
      completa-el-espacio contando ticks, 4 calculadoras guiadas (% de distancia del stop,
      tamaño de posición desde riesgo+stop, valor por movimiento, ganancia neta tras spread +
      comisiones) y 2 de opción múltiple (elegir el mejor stop según ATR, elegir tipo de orden en
      escenario volátil) — cubre los 6 ejercicios mínimos pedidos más 2 extra. Quiz final de 10
      preguntas.
- [x] 7 términos nuevos en `data/glossary.ts`: Tick/Tick size, Pip (marcado explícitamente como
      término de Forex), Bid/Ask, Comisión maker/taker, Lote, Tamaño de contrato, Valor por
      movimiento — usables con `<Term>` en cualquier página (Spread, Slippage y ATR ya existían
      del remaster anterior, no se duplicaron).
- [x] Integración con la Terminal: `lib/binance/tickSize.ts` (nuevo, tick size real verificado
      contra el `exchangeInfo` de Binance — $0.01 en BTCUSDT, $0.0001 en TRXUSDT — con
      `fetchTickSize` disponible para cualquier par futuro no mapeado). `OrderPanel.tsx` ahora
      muestra "Distancia del SL: $X · Y% · Z ticks" con un link "¿por qué tres?" a la lección,
      como línea separada de la ya existente "Si toca tu SL pierdes $X (Y% de tu cuenta)" para no
      mezclar distancia de precio con riesgo de cuenta.

Build y typecheck limpios en los 4 paquetes. Verificado en navegador: los 8 ejercicios resueltos
uno por uno con los valores exactos del enunciado (todos coincidieron con el cálculo a mano —
ej. ganancia neta 50−5−2−2=41 ✓), la lección llega a "Lección completada", el Nivel 6 ya aparece
desbloqueado en el mapa de Academia, los tooltips `<Term>` se activan automáticamente en el
cuerpo del texto, y la Terminal muestra la distancia del SL real ($1,920.01 · 2.99% · 192,001
ticks) verificada a mano. Barrido de regresión limpio en 28 rutas, cero errores de consola. Sin
push/deploy hasta que se pida explícitamente.

## Pestaña On-Chain — contenido educativo propio, sin APIs de pago

Pedido del usuario: una pestaña nueva del sidebar dedicada al análisis on-chain, explícitamente
**sin** integrar ninguna API de terceros de pago (Arkham/Nansen/Glassnode/etc. son de pago) —
todo el "wow" viene de contenido educativo original y diagramas SVG propios, no de datos en vivo
de terceros. El enlace a herramientas externas es solo eso: enlaces, nunca datos embebidos.

- [x] `data/onchainTools.ts` — directorio centralizado de 9 herramientas gratuitas/freemium
      (Tronscan, Etherscan, Blockchain.com Explorer, DeFiLlama, Arkham Intelligence, Bubblemaps,
      Nansen, Glassnode, Dune), cada una con etiquetado honesto GRATIS/FREEMIUM y, cuando aplica,
      una nota aclarando qué parte es de pago (ej. Arkham: "la visualización básica es gratis,
      los datos avanzados y alertas por API requieren plan de pago"). Nunca se presenta una
      herramienta freemium como si fuera 100% gratis.
- [x] 3 diagramas SVG originales nuevos (`components/onchain/diagrams/`): `DireccionSeudonima.tsx`
      (comparación "esto se ve" vs. "esto no se ve" para una dirección TRON), `GrafoDeFlujos.tsx`
      (grafo estilo Arkham con nodo central y flujos de entrada/salida coloreados, grosor de
      línea proporcional al tamaño), `EntidadEtiquetada.tsx` (código anónimo → cruce de datos →
      entidad etiquetada, con la salvedad "etiqueta = atribución, no certeza"). Reutiliza
      `CadenaDeBloques` de los diagramas de Academia en vez de duplicarlo.
- [x] `sections/OnChainPage.tsx` — 7 secciones: hero con caja "por qué importa" (la ventaja del
      inversor pequeño: mismos datos que ven ballenas e instituciones, gratis); 4 tarjetas de
      concepto con diagrama (blockchain pública, direcciones seudónimas, grafo de flujos, entidad
      etiquetada); 6 tarjetas de caso de uso (ballenas, flujos de exchanges, instituciones,
      hackeos/estafas, stablecoins con link a Stablecoins TRON, salud de red); caja roja **"Lo
      que on-chain NO puede hacer"** (no revela identidad con certeza, no predice el futuro, no
      es señal de compra/venta por sí sola — con link a Spider Intelligence y Gestión de Riesgo,
      cuidado con cuentas de "alerta de ballenas" que fabrican FOMO); directorio de las 9
      herramientas con botón "Abrir" (`rel="noopener noreferrer"`, nueva pestaña); tutorial
      práctico de 4 pasos "Tu primera investigación on-chain" con Tronscan y una dirección TRON
      real de ejemplo; cross-links a Stablecoins TRON, Spider Intelligence y Academia Nivel 9 más
      un botón "Explícame esto" que precarga una pregunta en Spider Chat.
- [x] Pestaña agregada a `lib/sections.ts` (ícono 🔗, ubicada junto a Fractales & Estructura) y
      ruta `/app/on-chain` en `App.tsx`.

Build y typecheck limpios en los 4 paquetes (incluyendo un fix de un atributo JSX con comillas
escapadas inválidas — `title="...\"...\""` no es válido dentro de un string JSX plano, se
corrigió envolviéndolo en una expresión `{'...'}`). Verificado en navegador: título, tarjetas de
Tronscan y Arkham presentes en el DOM, cero errores de consola, captura de página completa
confirma que los 4 diagramas SVG, el grid de 9 herramientas y todas las secciones se ven
correctas y con la estética de la plataforma. Barrido de regresión limpio en las 28 rutas de la
app. Sin push/deploy hasta que se pida explícitamente — es contenido nuevo e independiente, no
se envía hasta indicación directa.

## Bloque 14 — Meme Radar: buscador y analizador de memecoins de SunPump (TRON)

Pedido del usuario: un buscador/analizador de memecoins estilo Bubblemaps directo desde
SunPump.meme (el launchpad de memecoins de TRON), mostrando qué carteras compraron y cuánto,
liquidez, y watchlist — todo sin APIs de pago. SunPump no tiene API pública gratuita propia (la
única, de Bitquery, solo da un trial de 7 días), así que se investigó y verificó en vivo, antes
de construir nada, que su contrato inteligente es 100% legible gratis on-chain.

- [x] **Contrato de SunPump verificado en vivo**: `TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw`
      ("LaunchPadProxy", etiqueta azul oficial "SUN" de sun.io, activo desde 2024-08-09, 3.5M+
      transacciones). Es un único contrato para todo (sin pool por token), con eventos reales
      confirmados vía TronGrid: `TokenCreate`, `TokenPurchased`, `TokenSold`.
- [x] **Detección de tokens nuevos, probada de punta a punta con casos reales**: cuando el
      contrato emite `TokenCreate`, el token TRC20 recién creado emite su propio evento
      `Transfer` (de mint) en la misma transacción — su dirección es la del token nuevo. Se
      decodificó exitosamente 5/5 creaciones reales consecutivas, incluyendo una que se hace
      pasar por "Tether USDT" (mismo nombre y símbolo) — evidencia útil de por qué el disclaimer
      de riesgo importa. `lib/tronAddress.ts` (nuevo) convierte hex→base58check TRON, validado
      contra estos casos reales.
- [x] **Estado bonding-curve vs. graduado resuelto con DexScreener** (gratis, sin API key):
      `token-pairs/v1/tron/{address}` devuelve `[]` si el token no tiene pool todavía (curva de
      lanzamiento) o datos reales de precio/liquidez/volumen si ya migró a SunSwap — verificado
      en vivo con un par real (BTC/USDT en SunSwap, $2.06M de liquidez).
- [x] **Backend nuevo**: `providers/sunpump.ts` + `routes/meme.ts` (4 endpoints: `/api/meme/
      recent`, `/api/meme/token/:address`, `/token/:address/holders`,
      `/token/:address/clustering`), `packages/types/src/meme.ts` (schemas Zod). Holders vía
      TronScan (ya integrado, `token_trc20/holders` — la reserva no vendida del propio contrato
      SunPump se detecta y reporta aparte, no se mezcla con holders reales para no distorsionar
      el mapa de burbujas). Clustering: heurística propia (carteras fondeadas desde el mismo
      origen vía TronGrid), siempre etiquetada `isEstimate: true` — nunca presentada como
      certeza, mismo criterio que las Zonas de Apalancamiento de Contratos.
- [x] **Mapa de burbujas de holders construido desde cero**: no existe ninguna librería de
      grafos en el repo (d3-force/react-flow/sigma/cytoscape) — `lib/meme/forceLayout.ts` es un
      motor de física de repulsión/atracción hecho a mano, corriendo en un Web Worker
      (`bubbleLayout.worker.ts` + `useBubbleLayout.ts`, mismo patrón Comlink que el backtester)
      para no bloquear la UI con 50-100 nodos.
- [x] **Watchlist personal**: `store/memeWatchlistStore.ts` (Zustand + `persist`, mismo patrón
      que el Diario), agregar/quitar desde el panel de resumen de cada token.
- [x] Nueva pestaña "Meme Radar" (🫧) en el nav, ruta `/app/meme-radar`, con disclaimer de
      riesgo extremo específico de memecoins (no solo el NFA genérico) — explícito: sin conexión
      de wallet, sin compra/venta dentro de la app, solo información.
- [x] `TRONGRID_API_KEY` (provista por el usuario) agregada a `.env` local — pendiente
      configurarla en Netlify producción antes del deploy (el clasificador de permisos bloqueó
      hacerlo por API en esta sesión).

Build y typecheck limpios en los 4 paquetes. Verificado en navegador contra datos reales: feed
de 20 tokens recién creados carga en vivo, seleccionar uno muestra su estado real (probado tanto
en curva de lanzamiento como graduado con precio/liquidez reales), holders reales se separan
correctamente de la reserva del contrato, mapa de burbujas renderiza sin errores de consola,
seguir/dejar de seguir funciona y persiste tras recargar la página. Barrido de regresión limpio
en las 29 rutas de la app.

### Meme Radar v2 — ticker en vivo, identicons e imágenes reales

Pedido de seguimiento del usuario: la v1 se veía "muy simple", pidió llevarla a otro nivel —
más tecnológica, con sensación de estar en vivo, idealmente con un ticker de actividad arriba
(como el de sunpump.meme) e imágenes de los tokens, pero con estilo propio de Spider.

- [x] **Ticker de actividad en vivo, decodificado directo del contrato**: nuevo endpoint
      `/api/meme/activity` lee las transacciones recientes del contrato de SunPump y decodifica
      compras/ventas directo de su calldata (sin llamadas extra por evento, a diferencia de la
      detección de tokens nuevos) — el monto real en TRX de una compra sale del `call_value` de
      la transacción (confirmado en vivo: el mismo campo reveló la comisión real de creación de
      20 TRX, cruzando con el dato ya conocido). Las ventas no cargan TRX en la llamada, así que
      se muestran sin monto en vez de inventar una cifra. `ActivityTicker.tsx` (nuevo) — marquee
      CSS puro (keyframes nuevos en `tailwind.config.js`), sin librería externa.
- [x] **Imágenes reales cuando existen, identicon generado cuando no**: `imageUrl` nuevo en
      `MemeTokenSummary`, tomado de `info.imageUrl` de DexScreener — verificado en vivo que solo
      está presente para tokens con perfil enviado (los establecidos/graduados), nunca para
      tokens recién creados. Nunca se inventa una imagen — `lib/meme/identicon.ts` (nuevo)
      genera un avatar determinístico por dirección (estilo GitHub identicon, hecho a mano, sin
      dependencia) para cuando no hay imagen real, usado en el feed, la watchlist, el panel de
      resumen y el ticker.
- [x] **Feed de "recién creados" rediseñado** como tarjetas con identicon, borde con glow al
      pasar el mouse, y badge "● NUEVO" pulsante en el primero.

Build y typecheck limpios en los 4 paquetes. Verificado en navegador: 58 píldoras del ticker
(29 eventos × 2 para el loop continuo) con compras reales (USDT, 波牛, GNS, etc. — símbolos
reales resueltos en vivo), 78 identicons renderizados sin errores de consola, mapa de burbujas y
seguimiento funcionando igual que antes. Un 502 transitorio visto durante pruebas en paralelo se
confirmó como rate-limit momentáneo (no un bug) al repetir la misma llamada exitosamente.
Barrido de regresión limpio en las 29 rutas. Push y deploy pedidos por el usuario inmediatamente después — ver commit.

### Meme Radar v3 — fix de confiabilidad, identicons reales y burbujas interactivas

Feedback del usuario probando en producción: algunos tokens fallaban al cargar ("no se pudo
cargar este token"), los avatares se veían como cuadros sólidos sin forma ("no da fotos"), y
pidió que hacer clic en una burbuja llevara directo a la cartera y mostrara si hubo
transferencias reales entre los holders visualizados.

- [x] **Bug de confiabilidad encontrado y corregido**: reproducido en vivo contra producción —
      ráfagas de llamadas concurrentes (feed + ticker + selección de token) superaban el límite
      de tasa de TronScan y producían 502 intermitentes (confirmado disparando 6-12 llamadas
      concurrentes contra `spider-pro-ai.netlify.app`). Arreglado con: reintentos con backoff y
      jitter, una cola interna que serializa todas las llamadas a TronScan con espaciado mínimo
      (en vez de dejar que compitan y choquen entre sí), un caché corto de 20s en la info básica
      del token (se pedía duplicado desde 3 lugares distintos), y `/api/meme/token/:address`
      ahora degrada con gracia (`Promise.allSettled`) — si falla TronScan o DexScreener, la otra
      fuente igual responde en vez de tumbar todo el endpoint. Verificado: la misma ráfaga de 10
      llamadas concurrentes que antes fallaba a la mitad ahora responde 200 en todas.
- [x] **Identicons rediseñados**: el generador anterior (grilla de píxeles vía un LCG) tenía un
      bug real — el bit más bajo de un LCG clásico tiene un patrón casi constante, por eso los
      avatares se veían como cuadros sólidos sin textura. Reemplazado por un avatar de gradiente
      de dos tonos + las 2 primeras letras de la dirección — determinístico, siempre con
      contraste visible, cero dependencia nueva. Las imágenes reales de DexScreener (cuando
      existen) se siguen priorizando sobre el identicon.
- [x] **Burbujas interactivas**: clic en cualquier burbuja abre esa cartera directo en Tronscan
      (`tronscan.org/#/address/...`, pestaña nueva) — verificado con Playwright. Nuevo endpoint
      `/api/meme/token/:address/transfers` (TronScan `token_trc20/transfers`, verificado en
      vivo) dibuja líneas doradas entre dos holders del mapa cuando existe una transferencia real
      de ese token entre ellos — con conteo y monto real en el tooltip. La mayoría de los tokens
      en fase de curva de lanzamiento no van a mostrar líneas (las compras/ventas pasan por el
      contrato de SunPump, no de holder a holder directo) — se muestra un texto honesto
      ("sin transferencias directas detectadas todavía") en vez de dejarlo en blanco sin
      explicación.

Build y typecheck limpios en los 4 paquetes. Verificado en navegador: identicons con gradiente y
letras visibles, 49 burbujas renderizadas para un token con 67 holders, clic en burbuja confirma
apertura de `tronscan.org` en pestaña nueva, líneas de conexión renderizan cuando hay datos.
Barrido de regresión limpio en las 29 rutas.

### Meme Radar v4 — imágenes reales de SunPump y mapa de burbujas estilo radar

Feedback del usuario: seguía sin ver fotos reales, y pidió que el mapa de burbujas se sintiera
más moderno/tecnológico, no "tan simple".

- [x] **Fuente real de imágenes encontrada**: inspeccionando el bundle JS del propio sitio
      sunpump.meme se encontró su API pública no documentada (`api-v2.sunpump.meme/pump-api/
      token/{address}`, sin key, la misma que usa su frontend) — devuelve `logoUrl` real para
      prácticamente cualquier token, incluso creado hace segundos, a diferencia de DexScreener
      (que solo tiene imagen para tokens con perfil enviado, casi ninguno recién creado).
      Verificado en vivo devolviendo la imagen real de "Football Aliens". Mismo criterio ya
      usado en el proyecto para el bundle de TronScan (`fetchTronScanStats`): un endpoint público
      sin autenticación que el propio sitio usa para renderizarse. `fetchSunPumpLogo` (nuevo) se
      usa tanto en el resumen de token como en el feed de "recién creados" (`imageUrl` nuevo en
      `RecentTokenCreation`), con identicon como respaldo solo si de verdad no hay imagen.
- [x] **Mapa de holders rediseñado con estética "radar"**: fondo con gradiente radial oscuro,
      anillos concéntricos y cruz central (refuerza el nombre "Meme Radar"), barrido animado
      tipo radar (`animate-radar-sweep`, nuevo keyframe), burbujas con relleno degradado + glow
      (filtro SVG `feGaussianBlur`), líneas de conexión con trazo animado (`animate-dash-flow`)
      en vez de una línea estática.

Build y typecheck limpios en los 4 paquetes. Verificado en navegador: imagen real de "Football
Aliens" cargando en el panel de resumen, burbujas con el nuevo estilo radar renderizando sin
errores de consola. Barrido de regresión limpio en las 29 rutas.

## Backtester — introducción educativa profesional

Feedback del usuario: el Backtester era "muy simple" y no explicaba cómo funciona — en una
plataforma donde la gente aprende, necesitaba una introducción con instrucciones exactas y
explicar para qué sirve cada cosa, con un acabado profesional, no solo vistoso.

- [x] **Bloque "¿Qué es un backtest y para qué sirve?"** — explica en lenguaje simple qué
      pregunta responde un backtest y por qué es mejor que operar por intuición, coherente con
      la disciplina de "regla, no corazonada" del resto de la plataforma.
- [x] **Guía de 4 pasos** ("Elige el mercado y el rango" → "Define tu regla de entrada" →
      "Configura el riesgo" → "Ejecuta y lee los resultados con ojo crítico"), con un ejemplo
      concreto listo para correr con un clic ("deja la configuración por defecto y presiona
      Ejecutar").
- [x] **Texto de ayuda bajo cada campo no obvio** (Balance inicial, Riesgo por trade, Stop Loss,
      Take Profit, Condiciones de entrada) explicando qué controla cada uno en una línea, en vez
      de dejar los campos sin contexto.
- [x] **Explicación de cómo leer los resultados**, agregada bajo las tarjetas de métricas —
      aclara que Win Rate solo no dice nada sin Profit Factor, qué mide Max Drawdown en la
      práctica, y por qué Expectancy es el número que más importa. Términos automáticamente
      enlazados al Glosario vía `TermifiedText` (Win Rate, Profit Factor, Drawdown, Expectancy —
      ya existían como términos, solo faltaba usarlos aquí). Aviso amarillo automático cuando la
      corrida tiene menos de 30 operaciones, advirtiendo que la muestra es demasiado chica para
      sacar conclusiones.

Build y typecheck limpios en los 4 paquetes. Verificado en navegador: los 4 bloques educativos
nuevos visibles, un backtest real ejecutado de punta a punta (51 operaciones, BTC/USDT 4h RSI
14) muestra la explicación de resultados correctamente con los términos enlazados al glosario.
Barrido de regresión limpio en las 29 rutas.

## Meme Radar — fix leve: imágenes reales en el ticker de actividad

Feedback del usuario: la fila del ticker de actividad (arriba de la página) no mostraba las
imágenes reales de los tokens, aunque sí aparecían más abajo en el panel de resumen y en el mapa
de burbujas.

- [x] **`fetchRecentActivity` ahora resuelve también el logo de SunPump** por token (con caché en
      memoria de vida del proceso, igual que ya se hacía con el símbolo) y lo incluye en cada
      evento de compra/venta.
- [x] **`ActivityTicker`** renderiza la imagen real cuando está disponible, con el identicon como
      respaldo — mismo patrón ya usado en `RecentTokensFeed`.

Build limpio. Verificado con `pnpm run build` en los 4 paquetes.

## Indicadores técnicos, Academia y Paper Trading — auditoría y expansión completa

Pedido del usuario: revisar todo el repositorio y completar/mejorar un conjunto grande de
herramientas de análisis técnico, educación de conceptos de futuros, y el simulador de Paper
Trading. Antes de programar nada se auditó el estado real del código (no se asumió nada): ATR,
Awesome Oscillator y Volume Profile ya existían en `packages/indicators`; Pivot Points diarios ya
existían fuera del paquete; el Paper Trading con apalancamiento, margen aislado/cruzado, gestor de
posiciones con PnL en vivo y liquidación YA estaba completamente construido e integrado en la
Terminal — así que el trabajo real fue: agregar los indicadores realmente faltantes, cablearlos en
la Terminal, documentarlos todos en la Academia, cerrar el hueco de SL/TP profesional vía ATR
(Backtester + Terminal + ficha educativa en Contratos), y pulir el Paper Trading existente en vez
de reconstruirlo desde cero.

- [x] **7 indicadores nuevos en `packages/indicators`** (matemática pura, sin dependencias, mismo
      patrón que el resto del paquete): Fibonacci (retroceso + extensión), Heikin Ashi, SuperTrend
      (basado en ATR), Canal de Donchian, Canal de Keltner (basado en ATR), CMF (Chaikin Money
      Flow), Ichimoku Kinko Hyo (9/26/52, desplazamiento de 26).
- [x] **Cableado completo en la Terminal**: nuevos toggles en `useTerminalIndicators`/
      `IndicatorTogglesPanel`, overlays en `TerminalChart` (Heikin Ashi reemplaza las velas
      normales incluyendo la vela en vivo, SuperTrend con color según tendencia, Donchian/Keltner/
      Ichimoku como líneas, Fibonacci como niveles de precio sobre el swing más reciente de hasta
      100 velas), y ATR/CMF como nuevos paneles osciladores en `TerminalOscillators`.
- [x] **Pivot Points semanales**, junto a los diarios ya existentes — nueva consulta de velas 1w,
      mismo cálculo `classicPivots` reutilizado, toggle independiente en el gráfico.
- [x] **Stop Loss dinámico con ATR en el Backtester**: nuevo modo "% Fijo" vs "ATR" en el schema
      (`stopLossMode`, `atrMultiplier`), el motor (`runBacktestLoop`) calcula el SL a un múltiplo
      del ATR(14) de cada entrada en vez de un % fijo, y el tamaño de posición se deriva de la
      distancia real en precio (funciona igual para ambos modos). Un candle sin suficiente
      historial para el ATR simplemente no opera esa vela, en vez de caer a un % por defecto sin
      avisar.
- [x] **11 fichas nuevas en la Academia de Indicadores** (`indicatorGuides.ts`): AO, ATR, Volume
      Profile, Pivot Points, Fibonacci, Heikin Ashi, Ichimoku, SuperTrend, Donchian, Keltner, CMF
      — cada una con qué es, cómo se lee, cuándo usarlo, errores comunes y señales, mismo formato
      que las fichas ya existentes (RSI, MACD, Bollinger, etc.), sin tocar el componente que las
      renderiza (100% data-driven).
- [x] **Ficha "Stop Loss profesional: con ATR, no a ojo" en Contratos** — cierra explícitamente el
      hueco de "SL/TP calculados con ATR en vez de % al azar", con un ícono nuevo (sismógrafo,
      metáfora del cinturón de seguridad que se ajusta solo a la volatilidad) y enlaces directos al
      Backtester y a la Terminal.
- [x] **Panel de Futuros mejorado**: apalancamiento máximo subido de 50x a 100x (pedido explícito),
      y nuevo botón "Sugerir con ATR" junto al campo de Stop Loss que calcula un SL a 1.5× el
      ATR(14) actual del par/temporalidad activa, sin necesidad de calcularlo a mano.

Build y typecheck limpios en los 4 paquetes. Verificado en navegador con Playwright: los 9
indicadores nuevos se activan sin errores de consola en la Terminal (velas Heikin Ashi, líneas de
SuperTrend/Donchian/Keltner/Ichimoku, niveles de Fibonacci, pivots semanales, paneles ATR/CMF);
en Futuros, el slider de apalancamiento llega a 100x y el botón "Sugerir con ATR" rellena
correctamente el campo de Stop Loss con un precio real derivado del ATR; en el Backtester, el modo
"ATR" del Stop Loss muestra el multiplicador y su explicación; las 11 fichas nuevas de la Academia
de Indicadores se encontraron todas en el DOM; la ficha de Contratos se renderiza con el ícono
nuevo. Barrido de regresión limpio en las 27 rutas verificadas.

## Whale Watcher — nuevo módulo, balances públicos verificados de ballenas cripto

Pedido del usuario: expandir un módulo "Whale Watcher" con 15+ entidades (exchanges, instituciones,
políticos, fundadores) usando la API de Arkham. Investigación previa (obligatoria antes de escribir
código, mismo estándar que el resto del proyecto): el módulo no existía todavía en el repo, y la API
de Arkham resultó ser un "Pilot Program" gated — requiere aplicación y aprobación, sin tier gratuito
confirmado, chocando directo con el mandato de costo cero. Se presentó esto al usuario junto con una
alternativa 100% gratuita (direcciones públicas ya documentadas por investigación on-chain/prensa
cripto, consultadas en vivo vía RPCs públicos sin key), y el usuario eligió esa alternativa.

- [x] **Investigación y verificación en vivo de cada dirección** — cada una fue researcheada con
      fuente citable (Etherscan/TronScan/Blockchain.com como etiqueta de primera parte, o cobertura
      de CoinDesk/The Block/Decrypt/TRM Labs) y luego re-verificada con una llamada real a la
      blockchain antes de aceptarla. Esto atrapó un error real: la dirección de memoria para "Tether
      Treasury" tenía un carácter equivocado (checksum inválido, TronGrid la rechazó) — se corrigió
      con la dirección real confirmada en vivo (~$393M en USDT).
      Se descartaron explícitamente por falta de fuente creíble: una wallet personal de CZ, una
      única wallet de Coinbase (su custodia está fragmentada en miles de direcciones, no hay una
      "wallet ballena" dominante), y cualquier entidad adicional sin cita verificable — de ahí que
      la lista final sea 10 entidades bien verificadas en vez de 15+ especulativas.
- [x] **10 entidades configuradas** (`apps/api/src/data/whaleEntities.ts`, con fuente y nota de
      confianza por cada una): Vitalik Buterin, Justin Sun, Satoshi Nakamoto (dirección del bloque
      génesis, con aclaración explícita de que NO representa su fortuna real — solo una curiosidad
      histórica; la estimación seria de ~1.1M BTC del patrón Patoshi se explica como texto, sin
      wallet única rastreable), Binance, Tether Treasury, Strategy/MicroStrategy (tenencia
      declarada, no on-chain — sin dirección pública), BlackRock IBIT (mismo caso, sin cifra en vivo
      disponible en esta sesión), World Liberty Financial, y el token oficial $TRUMP en Solana.
- [x] **Backend nuevo, 100% sin API keys de pago**: `lib/ethRpc.ts` y `lib/solanaRpc.ts` (RPC JSON
      públicos y gratuitos — verificado en vivo que `eth.llamarpc.com` fallaba con Cloudflare 521 en
      esta sesión, se usó `ethereum.publicnode.com` en su lugar tras confirmar que sí respondía),
      `providers/tron.ts` extendido con `fetchTronAccountBalance` (TRX + TRC20 en una sola llamada),
      `providers/whales.ts` (orquesta balance nativo + tokens rastreados por dirección, precios de
      CoinGecko, agrega por entidad), rutas `GET /api/whales` y `GET /api/whales/:id`. El balance de
      WLFI (token de World Liberty Financial) se rastrea para Justin Sun y para WLF mismo — permite
      que el chat responda sobre su activo no-BTC más relevante.
- [x] **`WhaleWatcherPage.tsx` nueva**, con la estética pedida por el usuario (calcada de una
      captura de Arkham): avatar circular, cifra de patrimonio grande, badges de categoría/confianza,
      pestañas Portfolio / Direcciones por red, tabla Activo/Red/Holdings/Valor, y una barra de
      "distribución por red" (nuevo, pedido explícito) que muestra el % real de cada cadena sobre el
      total. Filtro rápido por categoría (Exchanges/Instituciones/Políticos/Fundadores) con conteo
      por categoría. Cada entidad muestra explícitamente si su dato es "EN VIVO ON-CHAIN" o
      "TENENCIA DECLARADA", y un aviso de que el balance rastreado es de direcciones específicas
      verificadas, no necesariamente el patrimonio total de la persona/empresa.
- [x] **Inteligencia de chat**: la página publica (`usePublishContext`) un resumen real de todas las
      entidades cargadas y el detalle de la seleccionada — mismas cifras que ve el usuario, sin
      inventar actividad reciente ("qué compró hoy" no es soportado, ya que no hay tracking de
      transacciones, solo balances actuales; esto se declara explícitamente en el contexto para que
      el asistente no invente una respuesta).

Build y typecheck limpios en los 4 paquetes. Cada dirección on-chain fue verificada con una llamada
real (mempool.space para BTC, RPC de Ethereum para ETH, TronGrid para TRON, RPC de Solana para SOL)
antes de aceptarse — no se usó ningún dato de memoria sin re-verificar. Verificado en navegador:
las 10 entidades cargan con cifras reales (Binance ~$20B coincide con 248,597 BTC + 1.99M ETH al
precio actual; Satoshi Genesis ~$3.7M en 57.3 BTC frozen+donaciones; Strategy ~$54.8B en 843,775 BTC
declarados), el filtro por categoría funciona, la barra de distribución por red refleja proporciones
reales, y el diseño responsive se probó en viewport móvil. Barrido de regresión limpio en las 28
rutas (un 502 transitorio de CoinGecko durante el barrido se confirmó como rate-limit temporal de mi
propio tráfico de pruebas, no una regresión — se re-verificó limpio después).
