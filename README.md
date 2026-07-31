# Spider Pro

Plataforma de análisis técnico y contexto cripto en tiempo real para Bitcoin, TRON y
cualquier otro token — velas japonesas con 13 indicadores configurables, contexto de
mercado (halvings, M2, sentimiento), herramientas de trading de marcos cortos y un
asistente conversacional que solo cita datos verificados.

## Stack

Monorepo Turborepo + pnpm workspaces:

- `apps/web` — Vite + React 18 + TypeScript + Tailwind
- `apps/api` — Fastify, empaquetado dual: servidor standalone y función serverless de Netlify
- `packages/indicators` — RSI, MACD, Bollinger, Estocástico, ADX, VWAP, Parabolic SAR y más, en TypeScript puro
- `packages/types` — schemas Zod compartidos entre frontend y backend

## Desarrollo local

```bash
pnpm install
cp .env.example .env   # completar las API keys
pnpm run dev            # web en :5173, api en :8787
```

## Build y despliegue

```bash
pnpm run build           # genera dist/ y netlify/functions/api.cjs vía Turborepo
pnpm run verify:netlify  # smoke test contra el bundle exacto que se despliega
```

El despliegue es automático: cada push a `master` dispara un build en Netlify
(`netlify.toml` define el comando de build, el directorio de publicación y las
funciones — no requiere configuración manual en el dashboard).

---
_Desplegado automáticamente vía GitHub → Netlify CI/CD._
