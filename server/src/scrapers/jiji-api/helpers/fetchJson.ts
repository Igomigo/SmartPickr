import { JIJI_API_HEADERS } from "../constants";

/**
 * Jiji's JSON API is Cloudflare-protected and blocks datacenter/proxy IPs
 * (incl. the deploy host and the residential proxies we tried). ScraperAPI
 * clears Cloudflare with its own trusted IP pool and returns the raw JSON.
 *
 * When SCRAPERAPI_KEY is set we route every request through ScraperAPI; unset =
 * direct fetch (works locally from a clean home IP, no credits burned).
 */
const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY;
const SCRAPERAPI_ENDPOINT = process.env.SCRAPERAPI_ENDPOINT;

/** Wrap a target URL so the request goes through ScraperAPI (when configured). */
function buildRequestUrl(targetUrl: string): string {
  if (!SCRAPERAPI_KEY) return targetUrl;
  const params = new URLSearchParams({
    api_key: SCRAPERAPI_KEY,
    url: targetUrl,
  });
  return `${SCRAPERAPI_ENDPOINT}?${params.toString()}`;
}

/**
 * Thin wrapper around fetch for Jiji's JSON API: routes through ScraperAPI when
 * configured, sends browser-like headers, and surfaces a clear error if
 * Cloudflare still challenges the request rather than returning garbage JSON.
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(buildRequestUrl(url), {
    headers: JIJI_API_HEADERS,
    redirect: "follow",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const challenged = /just a moment|cloudflare/i.test(body);
    throw new Error(
      challenged
        ? `[jiji-api] blocked by Cloudflare (status ${res.status}) — request IP not trusted`
        : `[jiji-api] request failed (status ${res.status}) for ${url}`,
    );
  }

  return (await res.json()) as T;
}
