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
