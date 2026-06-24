import { JIJI_API_HEADERS } from "../constants";

/**
 * Thin wrapper around fetch for Jiji's JSON API: sends browser-like headers,
 * follows redirects, and surfaces a clear error if Cloudflare challenges the
 * request (403 "Just a moment...") rather than returning garbage JSON.
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: JIJI_API_HEADERS, redirect: "follow" });

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
