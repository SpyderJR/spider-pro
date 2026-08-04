import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerHealthRoute } from "./routes/health.js";
import { registerKlinesRoute } from "./routes/klines.js";
import { registerMarketRoutes } from "./routes/market.js";
import { registerTronRoutes } from "./routes/tron.js";
import { registerBitcoinRoutes } from "./routes/bitcoin.js";
import { registerChatRoute } from "./routes/chat.js";
import { registerSearchRoute } from "./routes/search.js";
import { registerAccountRoutes } from "./routes/account.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  await app.register(cors, { origin: true });

  registerHealthRoute(app);
  registerKlinesRoute(app);
  registerMarketRoutes(app);
  registerTronRoutes(app);
  registerBitcoinRoutes(app);
  registerChatRoute(app);
  registerSearchRoute(app);
  registerAccountRoutes(app);

  return app;
}
