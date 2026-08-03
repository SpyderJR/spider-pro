export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "Mercado" | "Velas y gráfico" | "Fractales y estructura" | "Riesgo" | "Psicología" | "Operativa";
}

export const GLOSSARY: GlossaryTerm[] = [
  // Mercado
  { term: "Blockchain", definition: "Registro digital distribuido e inmutable donde se anotan todas las transacciones de una criptomoneda, mantenido por una red de computadoras en vez de un banco central.", category: "Mercado" },
  { term: "Market Cap", definition: "Capitalización de mercado: precio actual multiplicado por la cantidad de monedas en circulación. Sirve para comparar el tamaño relativo de dos criptoactivos.", category: "Mercado" },
  { term: "ATH", definition: "All-Time High: el precio más alto que alcanzó un activo en toda su historia.", category: "Mercado" },
  { term: "Halving", definition: "Evento programado de Bitcoin (cada ~4 años) que reduce a la mitad la recompensa que reciben los mineros por bloque, reduciendo la emisión de nuevas monedas.", category: "Mercado" },
  { term: "Stablecoin", definition: "Criptomoneda diseñada para mantener un valor estable, generalmente atada 1:1 al dólar (ej. USDT, USDC).", category: "Mercado" },
  { term: "Exchange", definition: "Plataforma donde se compran y venden criptomonedas, como Binance.", category: "Mercado" },
  { term: "Wallet", definition: "Billetera digital donde se guardan las claves privadas que dan acceso a tus criptomonedas.", category: "Mercado" },
  { term: "Liquidez", definition: "Facilidad con la que un activo puede comprarse o venderse sin mover mucho su precio. Más liquidez = spreads más chicos y menos slippage.", category: "Mercado" },
  { term: "Volumen", definition: "Cantidad total de un activo negociado en un período de tiempo. Un movimiento de precio con alto volumen es más confiable que uno con bajo volumen.", category: "Mercado" },
  { term: "Capitalización circulante", definition: "Cantidad de monedas de un criptoactivo que están actualmente en circulación (no todas las que existirán algún día).", category: "Mercado" },
  { term: "DeFi", definition: "Finanzas descentralizadas: servicios financieros (préstamos, intercambios, ahorro) construidos sobre blockchain sin intermediarios tradicionales.", category: "Mercado" },
  { term: "Altcoin", definition: "Cualquier criptomoneda que no sea Bitcoin.", category: "Mercado" },
  { term: "Fear & Greed Index", definition: "Índice de 0 a 100 que mide el sentimiento del mercado cripto combinando volatilidad, volumen, redes sociales y otros factores. Valores bajos indican miedo extremo, valores altos codicia extrema.", category: "Mercado" },

  // Velas y gráfico
  { term: "Vela japonesa", definition: "Representación gráfica del precio en un período: muestra apertura, cierre, máximo y mínimo. El cuerpo es la diferencia entre apertura y cierre; las mechas muestran los extremos.", category: "Velas y gráfico" },
  { term: "Mecha", definition: "Línea fina arriba o abajo del cuerpo de una vela que muestra el máximo y mínimo alcanzado, aunque el precio no haya cerrado ahí.", category: "Velas y gráfico" },
  { term: "Soporte", definition: "Nivel de precio donde históricamente la demanda ha sido lo suficientemente fuerte como para detener una caída.", category: "Velas y gráfico" },
  { term: "Resistencia", definition: "Nivel de precio donde históricamente la oferta ha sido lo suficientemente fuerte como para detener una subida.", category: "Velas y gráfico" },
  { term: "Tendencia alcista", definition: "Serie de máximos y mínimos cada vez más altos.", category: "Velas y gráfico" },
  { term: "Tendencia bajista", definition: "Serie de máximos y mínimos cada vez más bajos.", category: "Velas y gráfico" },
  { term: "Rango lateral", definition: "Período donde el precio se mueve entre un soporte y una resistencia sin definir una tendencia clara.", category: "Velas y gráfico" },
  { term: "RSI", definition: "Relative Strength Index: oscilador entre 0 y 100 que mide la velocidad y magnitud de los movimientos de precio. Por debajo de 30 se considera sobrevendido, por encima de 70 sobrecomprado.", category: "Velas y gráfico" },
  { term: "EMA", definition: "Media móvil exponencial: promedio del precio que da más peso a los datos recientes que a los antiguos, por lo que reacciona más rápido que una media simple.", category: "Velas y gráfico" },
  { term: "SMA", definition: "Media móvil simple: promedio del precio de los últimos N períodos, con el mismo peso para todos.", category: "Velas y gráfico" },
  { term: "Pivote (Pivot Point)", definition: "Nivel de precio calculado a partir del máximo, mínimo y cierre del período anterior, usado como referencia de soporte/resistencia intradiario.", category: "Velas y gráfico" },
  { term: "Awesome Oscillator (AO)", definition: "Indicador de momentum de Bill Williams que compara una media móvil de 5 períodos con una de 34 sobre el precio medio, mostrando la aceleración del mercado.", category: "Velas y gráfico" },
  { term: "Divergencia", definition: "Cuando el precio hace un nuevo máximo/mínimo pero un indicador (como el RSI) no lo confirma — suele anticipar un cambio de tendencia.", category: "Velas y gráfico" },
  { term: "Temporalidad (timeframe)", definition: "Duración de cada vela en un gráfico (ej. 15 minutos, 1 hora, 1 día). Temporalidades más altas filtran el ruido pero reaccionan más lento.", category: "Velas y gráfico" },

  // Fractales y estructura
  { term: "Fractal (Bill Williams)", definition: "Patrón de 5 velas donde la central tiene el mínimo (fractal alcista) o el máximo (fractal bajista) más extremo que las 2 velas a cada lado. Se confirma recién 2 velas después.", category: "Fractales y estructura" },
  { term: "Alligator", definition: "Indicador de Bill Williams formado por 3 medias móviles suavizadas desplazadas (mandíbula, dientes, labios) que identifica si el mercado está en tendencia o en rango.", category: "Fractales y estructura" },
  { term: "BOS (Break of Structure)", definition: "Ruptura de estructura: cuando el precio cierra más allá del último swing high/low confirmado, señalando continuación de la tendencia vigente.", category: "Fractales y estructura" },
  { term: "CHoCH (Change of Character)", definition: "Cambio de carácter: la primera ruptura de estructura en dirección opuesta a la tendencia vigente, posible primera señal de reversión.", category: "Fractales y estructura" },
  { term: "Swing High", definition: "Máximo local del precio, rodeado de mínimos a ambos lados — un punto de giro hacia abajo.", category: "Fractales y estructura" },
  { term: "Swing Low", definition: "Mínimo local del precio, rodeado de máximos a ambos lados — un punto de giro hacia arriba.", category: "Fractales y estructura" },
  { term: "HH / HL / LH / LL", definition: "Higher High, Higher Low, Lower High, Lower Low: la secuencia de máximos y mínimos que define si la estructura de mercado es alcista o bajista.", category: "Fractales y estructura" },
  { term: "Estructura de mercado", definition: "El patrón de swing highs y swing lows que define la tendencia vigente y dónde podría estar cambiando.", category: "Fractales y estructura" },
  { term: "Smart Money Concepts (SMC)", definition: "Marco de análisis técnico centrado en identificar estructura de mercado, liquidez y zonas donde participantes grandes podrían estar operando.", category: "Fractales y estructura" },
  { term: "Zona de liquidez", definition: "Área de precio donde se acumulan órdenes stop de muchos traders (típicamente justo debajo de soportes o arriba de resistencias obvias).", category: "Fractales y estructura" },

  // Riesgo
  { term: "Stop Loss (SL)", definition: "Orden que cierra automáticamente una posición cuando el precio llega a un nivel definido, limitando la pérdida máxima de la operación.", category: "Riesgo" },
  { term: "Take Profit (TP)", definition: "Orden que cierra automáticamente una posición cuando el precio llega a un nivel de ganancia definido.", category: "Riesgo" },
  { term: "Ratio Riesgo/Beneficio (R:R)", definition: "Relación entre cuánto arriesgás (distancia al SL) y cuánto podés ganar (distancia al TP). Un R:R de 1:3 significa arriesgar $1 para potencialmente ganar $3.", category: "Riesgo" },
  { term: "Tamaño de posición (Position Sizing)", definition: "Cantidad de capital destinada a una operación, calculada en función del % de riesgo que estás dispuesto a asumir sobre tu cuenta total.", category: "Riesgo" },
  { term: "Drawdown", definition: "Caída porcentual desde el punto más alto (peak) del balance de una cuenta hasta un punto más bajo posterior.", category: "Riesgo" },
  { term: "Apalancamiento", definition: "Multiplicador que permite operar con más capital del que realmente tenés depositado, amplificando tanto ganancias como pérdidas.", category: "Riesgo" },
  { term: "Margen", definition: "Capital que se deja como garantía para abrir una posición apalancada.", category: "Riesgo" },
  { term: "Liquidación", definition: "Cierre forzoso de una posición apalancada cuando las pérdidas consumen el margen disponible.", category: "Riesgo" },
  { term: "Win Rate", definition: "Porcentaje de operaciones cerradas en ganancia sobre el total de operaciones.", category: "Riesgo" },
  { term: "Profit Factor", definition: "Ganancia bruta total dividida por la pérdida bruta total. Un profit factor mayor a 1 significa que, en conjunto, se ganó más de lo que se perdió.", category: "Riesgo" },
  { term: "Racha (streak)", definition: "Serie consecutiva de operaciones ganadoras o perdedoras.", category: "Riesgo" },

  // Psicología
  { term: "FOMO", definition: "Fear Of Missing Out: entrar a una operación por miedo a quedarse afuera de un movimiento, sin un plan claro.", category: "Psicología" },
  { term: "FUD", definition: "Fear, Uncertainty and Doubt: información (a veces exagerada o falsa) que genera miedo e induce ventas de pánico.", category: "Psicología" },
  { term: "HODL", definition: "Mantener una posición a largo plazo sin vender pase lo que pase con el precio de corto plazo (del meme original 'hold' mal escrito).", category: "Psicología" },
  { term: "Revenge Trading", definition: "Abrir operaciones impulsivas después de una pérdida, buscando 'recuperar' rápido en vez de seguir el plan original.", category: "Psicología" },
  { term: "Sesgo de confirmación", definition: "Tendencia a buscar y valorar solo la información que confirma lo que ya creíamos, ignorando señales en contra.", category: "Psicología" },
  { term: "Exceso de confianza", definition: "Sesgo psicológico donde una racha de operaciones ganadoras lleva a subestimar el riesgo y sobredimensionar posiciones.", category: "Psicología" },
  { term: "Aversión a la pérdida", definition: "Tendencia a sentir el dolor de una pérdida con más intensidad que el placer de una ganancia equivalente, lo que puede llevar a mantener posiciones perdedoras demasiado tiempo.", category: "Psicología" },
  { term: "Disciplina operativa", definition: "Capacidad de seguir un plan de trading predefinido (entradas, SL, TP, tamaño de posición) sin desviarse por emociones del momento.", category: "Psicología" },

  // Operativa
  { term: "Orden de mercado", definition: "Orden que se ejecuta inmediatamente al mejor precio disponible.", category: "Operativa" },
  { term: "Orden límite", definition: "Orden que solo se ejecuta cuando el precio llega a un nivel específico definido de antemano.", category: "Operativa" },
  { term: "Slippage", definition: "Diferencia entre el precio esperado de una operación y el precio al que realmente se ejecuta, común en mercados de baja liquidez o alta volatilidad.", category: "Operativa" },
  { term: "Spread", definition: "Diferencia entre el mejor precio de compra (bid) y el mejor precio de venta (ask) en el order book.", category: "Operativa" },
  { term: "Long", definition: "Posición que gana si el precio sube (comprar bajo, vender alto).", category: "Operativa" },
  { term: "Short", definition: "Posición que gana si el precio baja (vender alto, recomprar bajo).", category: "Operativa" },
  { term: "Paper Trading", definition: "Práctica de operar con dinero simulado sobre precios reales de mercado, sin arriesgar capital real.", category: "Operativa" },
  { term: "Order Book", definition: "Libro de órdenes: lista en tiempo real de todas las órdenes de compra y venta pendientes para un par, ordenadas por precio.", category: "Operativa" },
  { term: "Par de trading", definition: "Combinación de dos activos que se pueden intercambiar entre sí, como BTC/USDT.", category: "Operativa" },
  { term: "Quantity (cantidad)", definition: "Cantidad del activo base que se compra o vende en una operación.", category: "Operativa" },
  { term: "P&L", definition: "Profit & Loss: la ganancia o pérdida, realizada o no realizada, de una posición o cuenta.", category: "Operativa" },
  { term: "Posición abierta", definition: "Operación que todavía no se cerró y cuyo resultado depende del precio actual del mercado.", category: "Operativa" },
  { term: "NFA", definition: "Not Financial Advice: aclaración de que un contenido es solo educativo/informativo y no una recomendación de inversión.", category: "Operativa" },
];
