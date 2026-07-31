import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Must be the first import in index.ts — loads the repo-root .env before any
// module that reads process.env (env.ts) gets evaluated.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../.env") });
