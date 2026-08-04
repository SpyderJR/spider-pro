import type { StablecoinSymbol } from "@spider/types";

export interface StablecoinInfo {
  symbol: StablecoinSymbol;
  name: string;
  issuer: string;
  backing: string;
  risk: string;
}

export const STABLECOIN_INFO: Record<StablecoinSymbol, StablecoinInfo> = {
  USDT: {
    symbol: "USDT",
    name: "Tether",
    issuer: "Tether Limited",
    backing: "Reservas de efectivo, bonos del Tesoro de EE. UU. de corto plazo y otros equivalentes de efectivo, según sus reportes de atestación trimestrales.",
    risk: "Tether puede congelar direcciones específicas por orden judicial o compliance — es un stablecoin centralizado, no censorship-resistant.",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    issuer: "Circle",
    backing: "Efectivo y bonos del Tesoro de EE. UU. de muy corto plazo, con atestaciones mensuales de una firma contable independiente.",
    risk: "Igual que USDT, Circle puede congelar direcciones — centralizado y sujeto a regulación de EE. UU.",
  },
  USDD: {
    symbol: "USDD",
    name: "Decentralized USD",
    issuer: "TRON DAO Reserve",
    backing: "Sobrecolateralizado con una canasta de criptoactivos (BTC, TRX, USDT) — no respaldado 1:1 por dólares reales en un banco.",
    risk: "Sufrió una pérdida temporal de paridad (de-peg) en 2022. El respaldo cripto-colateralizado es más volátil que el respaldo en efectivo tradicional.",
  },
  TUSD: {
    symbol: "TUSD",
    name: "TrueUSD",
    issuer: "Techteryx",
    backing: "Dólares en cuentas fiduciarias de terceros, con atestaciones publicadas en tiempo real por firmas independientes.",
    risk: "Stablecoin más chico y menos líquido que USDT/USDC — mayor riesgo de spreads amplios en momentos de estrés de mercado.",
  },
  USDJ: {
    symbol: "USDJ",
    name: "JUST Stablecoin",
    issuer: "Protocolo JUST (TRON DeFi)",
    backing: "Sobrecolateralizado con TRX bloqueado como garantía dentro del protocolo JUST, de forma similar a como DAI funciona sobre Ethereum.",
    risk: "Depende de la salud del protocolo JUST y del precio de TRX como colateral — riesgo de liquidaciones en cascada si TRX cae fuerte.",
  },
};
