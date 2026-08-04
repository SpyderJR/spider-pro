import type { AcademyLevelContent } from "./types";

export const NIVEL_01_FUNDAMENTOS: AcademyLevelContent = {
  id: "fundamentos-cripto",
  order: 1,
  title: "Fundamentos de cripto",
  description: "Qué es el dinero, por qué existe Bitcoin, cómo funciona una blockchain, y el vocabulario básico que vas a necesitar en el resto de la Academia.",
  difficulty: "principiante",
  icon: "🌱",
  lessons: [
    {
      id: "que-es-el-dinero",
      title: "Qué es el dinero y por qué existe Bitcoin",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "parrafo",
          texto:
            "El dinero, en el fondo, es solo un acuerdo colectivo: todos aceptamos que ciertos billetes, monedas o números en una pantalla representan valor, y los usamos para intercambiar bienes y servicios sin tener que hacer trueque directo. Durante siglos, ese acuerdo estuvo gestionado por gobiernos y bancos centrales, que deciden cuánto dinero nuevo emitir y controlan el sistema por el que se mueve.",
        },
        {
          type: "destacado",
          variante: "info",
          titulo: "EL PROBLEMA QUE BITCOIN INTENTÓ RESOLVER",
          texto:
            "En 2008, en medio de la crisis financiera global, alguien (o un grupo) bajo el seudónimo Satoshi Nakamoto publicó un documento proponiendo una forma de dinero digital que no necesitara un banco central ni ningún intermediario de confianza para funcionar — un sistema donde las reglas están escritas en código y las cumple una red de miles de computadoras, no una institución.",
        },
        {
          type: "analogia",
          texto:
            "Pensalo así: si vos y un amigo quieren llevar la cuenta de quién le debe plata a quién, pueden confiar en un tercero (un banco) que anota todo en su propio libro privado, o pueden usar un cuaderno público que miles de personas copian y verifican al mismo tiempo, de forma que nadie pueda borrar ni falsificar una página sin que el resto se dé cuenta. Bitcoin es ese segundo cuaderno.",
        },
        {
          type: "parrafo",
          texto:
            "Esto no significa que Bitcoin sea mejor o peor que el dinero tradicional en todos los sentidos — tiene sus propias ventajas (nadie puede imprimir más de los 21 millones de BTC que existirán, es difícil de censurar, funciona 24/7 en todo el mundo) y sus propias desventajas (es volátil, las transacciones son irreversibles si te equivocás, y todavía no todos los comercios lo aceptan). El objetivo de esta Academia es que entiendas cómo funciona antes de decidir si te sirve.",
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "opcionMultiple",
            id: "n1-l1-e1",
            pregunta: "¿Cuál es la diferencia más importante entre el dinero tradicional y Bitcoin?",
            opciones: [
              {
                texto: "Bitcoin es más rápido para pagar en cualquier comercio",
                correcta: false,
                explicacion: "La velocidad varía según el caso — esa no es la diferencia estructural más importante.",
              },
              {
                texto: "Bitcoin no depende de un banco central ni de un intermediario de confianza para funcionar",
                correcta: true,
                explicacion: "Correcto — las reglas de Bitcoin las hace cumplir una red descentralizada de computadoras, no una institución central.",
              },
              {
                texto: "Bitcoin lo controla un solo gobierno",
                correcta: false,
                explicacion: "Es exactamente al revés: ningún gobierno individual controla la red de Bitcoin.",
              },
              {
                texto: "No hay ninguna diferencia real",
                correcta: false,
                explicacion: "Sí hay una diferencia estructural fundamental: quién controla las reglas del sistema.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "blockchain-explicada-simple",
      title: "Blockchain explicada simple",
      estimatedMinutes: 6,
      blocks: [
        {
          type: "parrafo",
          texto:
            "Una blockchain (\"cadena de bloques\") es una base de datos compartida entre miles de computadoras (\"nodos\") en vez de vivir en un solo servidor central. Cada cierto tiempo, las transacciones nuevas se agrupan en un \"bloque\", y ese bloque se conecta al anterior incluyendo un hash (una huella digital matemática) del bloque previo — de ahí el nombre cadena.",
        },
        { type: "diagramaSVG", diagrama: "cadena-de-bloques", caption: "Cada bloque nuevo incluye el hash del anterior — por eso es una cadena." },
        {
          type: "destacado",
          variante: "exito",
          titulo: "POR QUÉ IMPORTA QUE SEA UNA CADENA",
          texto:
            "Si alguien quisiera alterar una transacción en el Bloque 2, el hash de ese bloque cambiaría — y como el Bloque 3 incluye el hash original del Bloque 2, ya no coincidiría. Tendría que reescribir el Bloque 2, 3, 4… todos los siguientes, y además convencer a la mayoría de la red de aceptar esa versión falsa. Con miles de nodos independientes verificando, eso es extremadamente difícil e improbable en las redes grandes.",
        },
        {
          type: "parrafo",
          texto:
            "Cada nodo de la red guarda una copia completa (o parcial, según el diseño) de esa cadena, y todos se ponen de acuerdo sobre cuál es la versión válida siguiendo un protocolo de consenso — en Bitcoin es Proof of Work (los mineros compiten resolviendo un problema matemático), en TRON es Delegated Proof of Stake (un grupo de validadores elegidos por votación de la comunidad confirma los bloques). Los dos logran el mismo objetivo por caminos distintos: que nadie pueda hacer trampa sin que el resto lo note.",
        },
        {
          type: "tip",
          texto: "\"Inmutable\" no significa \"perfecto\" — significa que una vez que algo está confirmado en la cadena y tiene varios bloques encima, es prácticamente imposible de alterar retroactivamente.",
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "verdaderoFalso",
            id: "n1-l2-e1",
            enunciado: "Cada bloque de una blockchain incluye una referencia (hash) al bloque anterior, formando una cadena.",
            respuesta: true,
            explicacion: "Así es — esa referencia es justamente lo que hace que alterar un bloque viejo requiera rehacer todos los bloques posteriores.",
          },
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "completaEspacio",
            id: "n1-l2-e2",
            plantilla: "En TRON, el mecanismo de consenso que valida los bloques se llama ___.",
            opciones: ["Proof of Work", "Delegated Proof of Stake", "Prueba de identidad", "Minería en la nube"],
            correcta: "Delegated Proof of Stake",
          },
        },
      ],
    },
    {
      id: "que-es-bitcoin",
      title: "Qué es Bitcoin y por qué no depende de un banco",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "parrafo",
          texto:
            "Bitcoin (BTC) fue la primera criptomoneda, lanzada en enero de 2009. Tiene un suministro máximo fijo de 21,000,000 de monedas — nadie, ni un gobierno ni una empresa, puede decidir imprimir más. Esa emisión limitada y decreciente (cada vez se minan menos BTC nuevos por bloque, algo que estudiás en detalle en la sección Halvings BTC) es una de las razones por las que muchos lo comparan con el oro digital.",
        },
        {
          type: "tabla",
          headers: ["Característica", "Dinero tradicional (ej. USD)", "Bitcoin"],
          filas: [
            ["Quién lo emite", "Banco central de cada país", "Reglas fijas de código, sin emisor central"],
            ["Suministro máximo", "Sin límite (se puede imprimir más)", "21,000,000 BTC, fijo para siempre"],
            ["Quién valida transacciones", "Bancos y procesadores centralizados", "Miles de nodos independientes en todo el mundo"],
            ["Horario de funcionamiento", "Horario bancario, días hábiles", "24 horas, 365 días al año"],
          ],
        },
        {
          type: "parrafo",
          texto:
            "Nadie \"es dueño\" de Bitcoin de la misma forma que una empresa es dueña de su producto. El software es de código abierto: cualquiera puede revisarlo, correr un nodo, o proponer cambios — pero cambiar las reglas fundamentales (como el límite de 21 millones) requeriría convencer a la enorme mayoría de la red de actualizar su software al mismo tiempo, algo que en la práctica casi nunca sucede para cambios controvertidos.",
        },
        {
          type: "errorComun",
          texto: "Pensar que \"comprar Bitcoin\" es como comprar acciones de una empresa que lo administra. No existe tal empresa — estás adquiriendo una porción de una red descentralizada.",
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "opcionMultiple",
            id: "n1-l3-e1",
            pregunta: "¿Cuál es el suministro máximo de Bitcoin que existirá alguna vez?",
            opciones: [
              { texto: "Ilimitado, se sigue emitiendo para siempre", correcta: false, explicacion: "Al revés — el límite fijo de 21 millones es una de las características definitorias de Bitcoin." },
              { texto: "21,000,000 BTC", correcta: true, explicacion: "Correcto. Ese límite está fijado en el protocolo desde su creación." },
              { texto: "100,000,000 BTC", correcta: false, explicacion: "No — el número correcto es 21 millones." },
              { texto: "Depende de cada país", correcta: false, explicacion: "El límite es global y único, no varía por país." },
            ],
          },
        },
      ],
    },
    {
      id: "que-es-tron",
      title: "Qué es TRON y en qué se diferencia",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "parrafo",
          texto:
            "TRON es otra blockchain, lanzada en 2018, con un enfoque distinto al de Bitcoin: en vez de priorizar ser \"oro digital\", TRON está diseñada para procesar transacciones muy rápido y con comisiones muy bajas — su bloque se confirma cada ~3 segundos, contra los ~10 minutos de Bitcoin. Eso la volvió la red preferida para mover stablecoins como USDT a nivel global (podés ver el detalle en vivo en la sección Stablecoins TRON).",
        },
        {
          type: "destacado",
          variante: "info",
          titulo: "TRX, el token nativo",
          texto: "TRX es la criptomoneda propia de la red TRON — se usa para pagar el \"combustible\" (ancho de banda y energía) que consume cada transacción y contrato inteligente en la red.",
        },
        {
          type: "parrafo",
          texto:
            "A diferencia de Bitcoin, TRON no tiene un límite máximo de suministro fijo — su emisión está controlada por un sistema de gobernanza, no por una regla matemática inmutable. Esto es una diferencia de diseño, no necesariamente una desventaja: cada blockchain hace trade-offs distintos entre descentralización, velocidad y flexibilidad.",
        },
        {
          type: "conecta",
          label: "Ver la ficha completa de TRON en vivo",
          to: "/app/tron",
          descripcion: "Precio en vivo, métricas de red reales (cuentas, transacciones, TPS) y ficha técnica.",
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "emparejar",
            id: "n1-l4-e1",
            instruccion: "Uní cada red con la característica que mejor la distingue.",
            pares: [
              { izquierda: "Bitcoin", derecha: "Suministro máximo fijo de 21 millones" },
              { izquierda: "TRON", derecha: "Bloques cada ~3 segundos, foco en pagos rápidos" },
              { izquierda: "Blockchain (en general)", derecha: "Base de datos compartida entre miles de nodos" },
            ],
          },
        },
      ],
    },
    {
      id: "como-leer-un-precio",
      title: "Cómo leer un precio",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "parrafo",
          texto:
            "Cuando ves el precio de BTC o TRX en cualquier pantalla de esta plataforma, hay varios números alrededor de ese precio que cuentan una historia mucho más completa que el número solo. Aprender a leerlos es el primer paso antes de mirar cualquier gráfico o indicador.",
        },
        {
          type: "lista",
          variante: "neutral",
          items: [
            "Precio: cuánto vale una unidad del activo en este momento, en dólares.",
            "Cambio 24h (%): cuánto subió o bajó el precio comparado con hace exactamente 24 horas — no predice nada hacia adelante, solo describe el pasado reciente.",
            "Market cap: precio actual × cantidad de monedas en circulación. Es una forma de comparar el \"tamaño\" de distintos activos más allá del precio unitario.",
            "ATH (All-Time High): el precio más alto que alcanzó ese activo en toda su historia. La \"distancia al ATH\" mide qué tan lejos está el precio actual de ese pico.",
            "Volumen: cuánto dinero se operó en un período — un precio que sube con mucho volumen es una señal más \"convincente\" que uno que sube con volumen bajo.",
          ],
        },
        {
          type: "analogia",
          texto:
            "El market cap es como comparar el valor total de dos edificios en vez de comparar el precio de un metro cuadrado — un activo con precio unitario bajo puede tener un market cap gigante si hay muchísimas unidades en circulación, y viceversa.",
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "calculadoraGuiada",
            id: "n1-l5-e1",
            instruccion: "Un activo tiene un precio de $2.50 y hay 800,000,000 de unidades en circulación. Calculá su market cap en millones de dólares.",
            campos: [
              { id: "precio", label: "Precio (USD)", placeholder: "2.50" },
              { id: "supply", label: "Supply circulante", placeholder: "800000000" },
            ],
            calcular: (v) => ((v.precio ?? 0) * (v.supply ?? 0)) / 1_000_000,
            unidad: "millones USD",
            tolerancia: 5,
          },
        },
      ],
    },
    {
      id: "exchanges-wallets-seguridad",
      title: "Exchanges, wallets, custodia y seguridad básica",
      estimatedMinutes: 6,
      blocks: [
        {
          type: "parrafo",
          texto:
            "Un exchange (como Binance) es una empresa que opera una plataforma para comprar, vender e intercambiar criptomonedas — es el punto de entrada más común para la mayoría de la gente. Una wallet (billetera) es la herramienta que guarda las claves privadas que demuestran que cierta cripto, registrada en la blockchain, te pertenece a vos.",
        },
        { type: "diagramaSVG", diagrama: "custodia-wallet", caption: "La diferencia central es quién controla las claves privadas." },
        {
          type: "destacado",
          variante: "advertencia",
          titulo: "\"NOT YOUR KEYS, NOT YOUR COINS\"",
          texto:
            "Cuando dejás tu cripto en un exchange, técnicamente el exchange tiene las claves — vos tenés una promesa (un registro en su base de datos interna) de que te la van a devolver cuando la pidas. La mayoría de las veces funciona bien, pero la historia de cripto tiene varios casos de exchanges que quebraron o fueron hackeados y los usuarios no pudieron recuperar sus fondos. Mover cripto a una wallet propia elimina ese riesgo específico, a cambio de que ahora VOS sos responsable de no perder tus claves.",
        },
        {
          type: "lista",
          variante: "buenas",
          items: [
            "Activar autenticación de dos factores (2FA) en cualquier exchange que uses.",
            "Nunca compartir tu frase semilla (seed phrase) con nadie, bajo ninguna circunstancia.",
            "Usar contraseñas únicas y un gestor de contraseñas, no la misma clave en todos lados.",
            "Empezar con montos chicos hasta entender bien cómo funciona cada herramienta.",
          ],
        },
        {
          type: "lista",
          variante: "errores",
          items: [
            "Guardar la frase semilla en una foto del celular o en la nube sin cifrar.",
            "Hacer click en links de \"soporte\" que llegan por mensaje privado no solicitado.",
            "Mandar cripto a una dirección sin verificar los primeros y últimos caracteres.",
            "Dejar montos grandes en un exchange \"porque es más cómodo\".",
          ],
        },
        {
          type: "ejercicio",
          ejercicio: {
            kind: "ordenar",
            id: "n1-l6-e1",
            instruccion: "Ordená estas prácticas de seguridad de MENOS a MÁS crítica si tuvieras que priorizar solo una.",
            items: [
              { id: "a", texto: "Usar una contraseña única para el exchange" },
              { id: "b", texto: "Activar 2FA" },
              { id: "c", texto: "Nunca compartir tu frase semilla con nadie" },
            ],
            ordenCorrecto: ["a", "b", "c"],
          },
        },
      ],
    },
  ],
  quiz: [
    {
      question: "¿Qué es Bitcoin, en esencia?",
      options: [
        "Una empresa que cotiza en bolsa",
        "Una moneda digital descentralizada, sin banco central que la controle",
        "Un fondo de inversión administrado por un banco",
        "Una tarjeta de crédito internacional",
      ],
      correctIndex: 1,
      explanation: "Bitcoin es una red descentralizada: no hay un banco central ni una empresa que la controle — la validan miles de participantes independientes.",
    },
    {
      question: "¿Qué es TRX en esta plataforma?",
      options: ["El navegador oficial de TRON", "El token nativo de la red TRON", "Un tipo de wallet", "Un indicador técnico"],
      correctIndex: 1,
      explanation: "TRX es la criptomoneda nativa de la blockchain TRON — se usa para pagar el combustible de cada transacción en la red.",
    },
    {
      question: "¿Qué hace que una blockchain sea difícil de alterar retroactivamente?",
      options: [
        "Que un solo administrador la controla",
        "Que cada bloque incluye el hash del bloque anterior, y miles de nodos verifican la cadena",
        "Que está guardada en un solo servidor muy seguro",
        "Que nadie puede ver las transacciones",
      ],
      correctIndex: 1,
      explanation: "Alterar un bloque viejo rompería el hash que los bloques siguientes referencian, y requeriría reescribir todos los bloques posteriores además de convencer a la mayoría de la red.",
    },
    {
      question: "¿Cuál es el suministro máximo de Bitcoin?",
      options: ["100,000,000 BTC", "21,000,000 BTC", "Sin límite", "1,000,000,000 BTC"],
      correctIndex: 1,
      explanation: "21 millones es el límite fijo escrito en el protocolo de Bitcoin desde su creación.",
    },
    {
      question: "¿En qué se diferencia principalmente TRON de Bitcoin?",
      options: [
        "TRON no usa blockchain",
        "TRON prioriza velocidad y comisiones bajas (bloques cada ~3 segundos), Bitcoin prioriza ser un activo de reserva con emisión fija",
        "No hay ninguna diferencia real entre ambas",
        "TRON solo funciona en Asia",
      ],
      correctIndex: 1,
      explanation: "Cada blockchain hace trade-offs de diseño distintos — TRON optimiza velocidad y costo, Bitcoin optimiza seguridad y escasez fija.",
    },
    {
      question: "Si BTC vale $63,700 y subió +1.10% en las últimas 24h, ¿qué representa ese +1.10%?",
      options: [
        "Cuánto subirá mañana",
        "El cambio porcentual respecto al precio de hace 24 horas",
        "La comisión del exchange",
        "El volumen operado",
      ],
      correctIndex: 1,
      explanation: "El % de cambio de 24h siempre compara el precio actual contra el precio de exactamente 24 horas atrás — no predice nada hacia adelante.",
    },
    {
      question: "¿Qué es el 'market cap' (capitalización de mercado)?",
      options: [
        "El precio máximo histórico del activo",
        "El precio actual multiplicado por la cantidad total de monedas en circulación",
        "La cantidad de exchanges donde cotiza",
        "El volumen operado en el último minuto",
      ],
      correctIndex: 1,
      explanation: "Market cap = precio × supply circulante. Es una forma de comparar el 'tamaño' relativo de distintos activos, más allá del precio unitario.",
    },
    {
      question: "¿Qué es el ATH (All-Time High)?",
      options: [
        "El precio promedio de los últimos 30 días",
        "El precio más alto que alcanzó ese activo en toda su historia",
        "Un tipo de orden límite",
        "El precio mínimo de todos los tiempos",
      ],
      correctIndex: 1,
      explanation: "ATH es el máximo histórico — la 'distancia al ATH' que ves en varias secciones mide qué tan lejos está el precio actual de ese pico.",
    },
    {
      question: "¿Qué significa la frase \"not your keys, not your coins\"?",
      options: [
        "Que necesitás una llave física para minar cripto",
        "Que si no tenés vos las claves privadas (ej. tu cripto está en un exchange), técnicamente dependés de que ese tercero te la devuelva",
        "Que las contraseñas de wallets nunca se pueden recuperar",
        "Que solo los exchanges pueden generar claves privadas",
      ],
      correctIndex: 1,
      explanation: "Dejar cripto en un exchange significa confiar en que esa empresa te la devuelva — mover fondos a una wallet propia elimina ese riesgo específico, a cambio de responsabilidad total sobre tus propias claves.",
    },
    {
      question: "¿Cuál de estas es una buena práctica de seguridad básica?",
      options: [
        "Compartir tu frase semilla con soporte técnico si te la piden por mensaje",
        "Activar autenticación de dos factores (2FA) en tus cuentas de exchange",
        "Guardar tu frase semilla en una nota sin cifrar en la nube",
        "Usar la misma contraseña en todos los exchanges",
      ],
      correctIndex: 1,
      explanation: "El 2FA agrega una capa extra de seguridad. Ningún soporte legítimo te va a pedir tu frase semilla jamás — pedirla es la señal más clara de una estafa.",
    },
    {
      question: "¿Por qué la Terminal de esta plataforma usa dinero ficticio en vez de dinero real?",
      options: [
        "Porque todavía no soporta dinero real",
        "Para que puedas practicar y equivocarte sin arriesgar dinero de verdad, con datos de precio 100% reales",
        "Porque cobra comisión",
        "Porque es solo para usuarios avanzados",
      ],
      correctIndex: 1,
      explanation: "El objetivo es aprender: los precios y la ejecución son reales (Binance en vivo), pero el dinero es simulado — el error acá no cuesta nada, la lección sí queda.",
    },
  ],
};
