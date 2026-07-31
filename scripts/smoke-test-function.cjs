// Simulates real Netlify invocations against the bundled function, exactly as
// Netlify's Lambda runtime would call it, to catch bundling/runtime issues
// before they'd surface as a broken production deploy.
// Run with: node --env-file=.env scripts/smoke-test-function.cjs
const { handler } = require("../netlify/functions/api.cjs");

function makeEvent(httpMethod, path, queryStringParameters, body) {
  return {
    httpMethod,
    path,
    queryStringParameters: queryStringParameters ?? {},
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  };
}

async function run() {
  const cases = [
    ["GET", "/.netlify/functions/api/health", undefined, undefined],
    ["GET", "/.netlify/functions/api/api/market/fear-greed", undefined, undefined],
    ["GET", "/.netlify/functions/api/api/klines", { symbol: "BTC", interval: "1d", limit: "20" }, undefined],
    ["GET", "/.netlify/functions/api/api/klines", { symbol: "BTC", interval: "1h", limit: "20" }, undefined],
    ["GET", "/.netlify/functions/api/api/klines", { symbol: "BTC", interval: "5m", limit: "20" }, undefined],
    ["GET", "/.netlify/functions/api/api/market/coins", { ids: "bitcoin,tron" }, undefined],
    ["GET", "/.netlify/functions/api/api/tron/stats", undefined, undefined],
    ["GET", "/.netlify/functions/api/api/market/search", { query: "ethereum" }, undefined],
    [
      "POST",
      "/.netlify/functions/api/api/chat",
      undefined,
      { message: "precio actual?", page: "bitcoin", context: { price: 64000 } },
    ],
  ];

  let failed = false;
  for (const [method, p, qs, body] of cases) {
    const res = await handler(makeEvent(method, p, qs, body), {});
    const ok = res.statusCode >= 200 && res.statusCode < 300;
    console.log(`${ok ? "OK  " : "FAIL"} ${method} ${p} -> ${res.statusCode}`);
    if (!ok) {
      failed = true;
      console.log("  body:", res.body?.slice(0, 300));
    }
  }

  if (failed) {
    console.error("\nSmoke test FAILED");
    process.exit(1);
  }
  console.log("\nSmoke test passed — bundled function responds correctly.");
}

run().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
