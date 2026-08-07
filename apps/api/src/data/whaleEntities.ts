import type { WhaleCategory, WhaleChain, WhaleConfidence } from "@spider/types";

export interface WhaleTokenConfig {
  symbol: string;
  contract: string;
  /** Only needed for TRON (TronGrid returns raw integer amounts) — ETH tokens read their own
   * `decimals()` on-chain instead, see lib/ethRpc.ts. */
  decimals?: number;
}

export interface WhaleAddressConfig {
  chain: WhaleChain;
  address: string;
  nativeSymbol: string;
  /** Extra tokens (beyond the native coin) worth checking for this address — kept short and
   * deliberate, never "every token this wallet has ever touched", since each one is a contract
   * address that has to be individually verified before being trusted. */
  tokens?: WhaleTokenConfig[];
}

export interface WhaleEntityConfig {
  id: string;
  name: string;
  category: WhaleCategory;
  avatarEmoji: string;
  avatarColor: string;
  tags: string[];
  dataMode: "onchain" | "declared";
  confidence: WhaleConfidence;
  addresses: WhaleAddressConfig[];
  /** Only for dataMode "declared" — no single verifiable on-chain address exists, so the figure
   * comes straight from the entity's own disclosure instead of a live balance read. */
  declaredValueUsd?: number;
  declaredNote?: string;
  /** See WhaleEntity.externalEstimateNote in @spider/types — a cited "the real number is
   * probably much higher, here's who says so and why we can't verify it ourselves" note. */
  externalEstimateNote?: string;
  sourceUrl: string;
  sourceNote: string;
}

// USDT's TRC20 contract on TRON — already verified and used elsewhere in this codebase
// (providers/tron.ts's TRC20_CONTRACT map).
const USDT_TRON = { symbol: "USDT", contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", decimals: 6 };

// World Liberty Financial's own governance token — verified live against Etherscan and WLF's
// own docs (docs.worldlibertyfinancial.com/wlfi-token/contract-addresses) before shipping this,
// since a wrong contract address here would silently show fabricated token data.
const WLFI_ETH = { symbol: "WLFI", contract: "0xdA5e1988097297dCdc1f90D4dfE7909e847CBeF6" };

/**
 * Every entry here was individually researched and sourced — see `sourceUrl`/`sourceNote`. Never
 * add an entity or address without a citable source; a wrong attribution here would misassign
 * real transactions to the wrong person, which is worse than not listing the entity at all. This
 * is why the list is ~10 entities instead of the 15+ originally requested — several other
 * candidates (Coinbase's single wallet, CZ's personal wallet, additional political figures) were
 * researched and explicitly rejected for lack of a credible source. Extend this list only after
 * the same bar is met.
 */
export const WHALE_ENTITIES: WhaleEntityConfig[] = [
  // ---- Founders ----
  {
    id: "vitalik-buterin",
    name: "Vitalik Buterin",
    category: "founder",
    avatarEmoji: "🦄",
    avatarColor: "#3ba8ff",
    tags: ["Cofundador de Ethereum"],
    dataMode: "onchain",
    confidence: "widely-reported",
    addresses: [{ chain: "ETH", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", nativeSymbol: "ETH" }],
    sourceUrl: "https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    sourceNote:
      "La dirección detrás del ENS 'vitalik.eth' — un nombre autoregistrado y controlado por su dueño, no una etiqueta de tercero. Referenciada consistentemente por medios cripto durante años como su wallet pública principal.",
  },
  {
    id: "justin-sun",
    name: "Justin Sun",
    category: "founder",
    avatarEmoji: "☀",
    avatarColor: "#ffcf4d",
    tags: ["Fundador de TRON"],
    dataMode: "onchain",
    confidence: "widely-reported",
    addresses: [
      { chain: "ETH", address: "0x3ddfa8ec3052539b6c9549f12cea2c295cff5296", nativeSymbol: "ETH", tokens: [WLFI_ETH] },
    ],
    externalEstimateNote:
      "Su patrimonio real es reportado en miles de millones — Arkham Intelligence estima entre $5,000M y $8,000M (incluyendo su participación en los exchanges HTX y Poloniex, que no es un activo on-chain), y Bloomberg lo reportó en $12,400M en agosto de 2025. Arkham mismo reconoce que ~142 wallets adicionales 'podrían' pertenecerle, basado en patrones de transacciones, no en confirmación directa — es exactamente ese tipo de atribución no verificable la que este módulo evita mostrar como si fuera un dato confirmado.",
    sourceUrl: "https://www.coindesk.com/tech/2025/09/04/world-liberty-financial-blacklists-justin-sun-s-address-with-usd107m-wlfi",
    sourceNote:
      "Dirección atribuida a Sun por Arkham y Nansen, y reportada de forma independiente por The Block, CoinDesk y Decrypt en septiembre de 2025, cuando World Liberty Financial bloqueó esta dirección tras mover ~$107M en tokens WLFI.",
  },
  {
    id: "satoshi-nakamoto",
    name: "Satoshi Nakamoto",
    category: "historical",
    avatarEmoji: "👤",
    avatarColor: "#94a3b8",
    tags: ["Creador de Bitcoin", "Identidad nunca confirmada"],
    dataMode: "onchain",
    confidence: "declared",
    addresses: [{ chain: "BTC", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", nativeSymbol: "BTC" }],
    declaredNote:
      "Esta dirección es la del bloque génesis de Bitcoin — sus 50 BTC originales están permanentemente congelados por una particularidad del protocolo (nunca entraron al set de UTXOs) y NO representan la fortuna real de Satoshi. La estimación seria y ampliamente citada es de ~1.1 millones de BTC, basada en el 'patrón Patoshi' identificado por el investigador Sergio Demian Lerner en ~22,000 de los primeros ~36,000 bloques minados — una inferencia estadística fuerte, no una prueba criptográfica de identidad. No existe una única 'wallet de Satoshi' rastreable en vivo.",
    sourceUrl: "https://en.bitcoin.it/wiki/Genesis_block",
    sourceNote:
      "El saldo mostrado aquí es del bloque génesis (curiosidad histórica, congelado para siempre) — no confundir con la estimación de 1.1M BTC del patrón Patoshi, que corresponde a miles de direcciones distintas sin una sola wallet identificable.",
  },

  // ---- Exchanges ----
  {
    id: "binance",
    name: "Binance",
    category: "exchange",
    avatarEmoji: "🔶",
    avatarColor: "#f0b90b",
    tags: ["Exchange más grande por volumen"],
    dataMode: "onchain",
    confidence: "verified",
    addresses: [
      { chain: "BTC", address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo", nativeSymbol: "BTC" },
      { chain: "ETH", address: "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8", nativeSymbol: "ETH" },
    ],
    sourceUrl: "https://www.coindesk.com/business/2022/11/10/binance-releases-wallet-addresses-of-69b-crypto-reserve",
    sourceNote:
      "Binance publicó estas direcciones ella misma en noviembre de 2022 como parte de su anuncio de prueba de reservas — no es una atribución de terceros. La dirección BTC además está etiquetada como 'Binance Cold Wallet' por múltiples exploradores; la de ETH lleva la etiqueta de primera parte 'Binance 7' en Etherscan.",
  },

  // ---- Institutions ----
  {
    id: "tether-treasury",
    name: "Tether Treasury",
    category: "institution",
    avatarEmoji: "🟢",
    avatarColor: "#26a17b",
    tags: ["Emisor de USDT"],
    dataMode: "onchain",
    confidence: "verified",
    addresses: [
      {
        chain: "TRON",
        address: "TKHuVq1oKVruCGLvqVexFs6dawKv6fQgFs",
        nativeSymbol: "TRX",
        tokens: [USDT_TRON],
      },
    ],
    sourceUrl: "https://tronscan.org/#/address/TKHuVq1oKVruCGLvqVexFs6dawKv6fQgFs",
    sourceNote:
      "La wallet que Tether usa para emitir (mint) y retirar (burn) USDT en TRON — etiquetada directamente como 'Tether Treasury' por TronScan, una de las direcciones más monitoreadas de toda la red por su rol en la emisión del stablecoin más grande del mundo.",
  },
  {
    id: "strategy-mstr",
    name: "Strategy (MicroStrategy)",
    category: "institution",
    avatarEmoji: "🟠",
    avatarColor: "#ff6b00",
    tags: ["Mayor tesorería corporativa de BTC"],
    dataMode: "declared",
    confidence: "declared",
    addresses: [],
    declaredValueUsd: undefined,
    declaredNote:
      "Strategy no publica direcciones on-chain de sus tenencias. La cifra mostrada viene de su propio reporte de inversionistas (strategy.com/purchases), actualizado por la empresa cada vez que compra — no es un saldo leído en vivo de la blockchain.",
    sourceUrl: "https://www.strategy.com/purchases",
    sourceNote:
      "Página oficial de relación con inversionistas de Strategy — la fuente más actualizada de su posición total en BTC, aunque no verificable on-chain al no publicar direcciones.",
  },
  {
    id: "blackrock-ibit",
    name: "BlackRock — iShares Bitcoin Trust (IBIT)",
    category: "institution",
    avatarEmoji: "⬛",
    avatarColor: "#000000",
    tags: ["ETF de Bitcoin más grande"],
    dataMode: "declared",
    confidence: "declared",
    addresses: [],
    declaredNote:
      "Los BTC del ETF IBIT están en custodia de Coinbase Custody sin una dirección individual atribuida públicamente por BlackRock. La cifra de este ETF se publica oficialmente en la página del fondo, no se lee on-chain.",
    sourceUrl: "https://www.ishares.com/us/products/333011/ishares-bitcoin-trust-etf",
    sourceNote: "Página oficial del fondo IBIT en iShares — holdings, NAV y activos totales publicados por BlackRock.",
  },

  // ---- Políticos / figuras públicas ----
  {
    id: "world-liberty-financial",
    name: "World Liberty Financial",
    category: "political",
    avatarEmoji: "🏛",
    avatarColor: "#c9a227",
    tags: ["Proyecto DeFi de la familia Trump"],
    dataMode: "onchain",
    confidence: "widely-reported",
    addresses: [
      { chain: "ETH", address: "0x5be9a4959308a0d0c7bc0870e319314d8d957dbb", nativeSymbol: "ETH", tokens: [WLFI_ETH] },
    ],
    sourceUrl: "https://etherscan.io/address/0x5be9a4959308a0d0c7bc0870e319314d8d957dbb",
    sourceNote:
      "Etherscan etiqueta esta dirección como 'World Liberty: Multisig' (etiqueta de primera parte). Medios cripto (CoinDesk, The Block, Decrypt) han referenciado consistentemente su actividad como la tesorería de WLF, incluyendo el bloqueo a Justin Sun ejecutado desde aquí en septiembre de 2025.",
  },
  {
    id: "trump-memecoin",
    name: "Oficial $TRUMP (memecoin)",
    category: "political",
    avatarEmoji: "🇺🇸",
    avatarColor: "#b91c1c",
    tags: ["Memecoin oficial de Donald Trump", "Solana"],
    dataMode: "onchain",
    confidence: "widely-reported",
    addresses: [{ chain: "SOL", address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN", nativeSymbol: "SOL" }],
    sourceUrl: "https://www.trmlabs.com/resources/blog/tracing-trump",
    sourceNote:
      "TRM Labs (firma de forense blockchain) identificó esta como la dirección creadora/tesorería del token oficial $TRUMP, lanzado en enero de 2025 por entidades afiliadas a la Organización Trump (CIC Digital LLC y Fight Fight Fight LLC, confirmadas por el propio sitio del proyecto). La atribución de la dirección específica viene de investigación forense, no de un comunicado directo de la empresa.",
  },
];
