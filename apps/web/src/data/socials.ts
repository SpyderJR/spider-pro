export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  handle: string;
}

/**
 * Estructura centralizada de redes sociales — agregar Discord/Telegram/YouTube más
 * adelante es solo agregar una entrada acá, sin tocar ningún componente.
 */
export const SOCIALS: SocialLink[] = [
  { id: "x", label: "X (Twitter)", url: "https://x.com/Spyde3rAI", icon: "𝕏", handle: "@Spyde3rAI" },
];
