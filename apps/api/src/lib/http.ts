export class ProviderError extends Error {
  constructor(
    public provider: string,
    message: string,
    public cause?: unknown,
  ) {
    super(`[${provider}] ${message}`);
    this.name = "ProviderError";
  }
}

export async function fetchJson<T>(
  provider: string,
  url: string,
  init?: RequestInit,
  timeoutMs = 8000,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      // Geo-blocked / rate-limited responses (e.g. Binance's 451 for cloud/US
      // IPs) usually explain themselves in the body — worth a line in the logs.
      const snippet = await res.text().then((t) => t.slice(0, 200)).catch(() => "");
      throw new ProviderError(provider, `HTTP ${res.status} for ${url}${snippet ? ` — ${snippet}` : ""}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw new ProviderError(provider, `request failed: ${(err as Error).message}`, err);
  } finally {
    clearTimeout(timeout);
  }
}
