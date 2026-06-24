/**
 * Jiji exposes a clean JSON API behind its Nuxt frontend. We hit it directly
 * instead of driving a headless browser — no Chromium, no Cloudflare/Turnstile
 * browser fight, and richer data (full image gallery, structured price, full
 * specs in one call).
 *
 * NOTE: these endpoints are still Cloudflare-protected at the IP level, so the
 * request must originate from an IP Cloudflare trusts (clean residential / the
 * deploy host's own IP). That is an infra concern, not a code one.
 */
export const JIJI_BASE_URL = "https://jiji.ng";

// Search/listing: GET ?query=<term>&slug= -> { adverts_list: { adverts: [...] } }
export const JIJI_LISTING_ENDPOINT = `${JIJI_BASE_URL}/api_web/v1/listing`;

// Product detail: GET /<guid> -> { advert: {...}, seller: {...} }
export const JIJI_ITEM_ENDPOINT = `${JIJI_BASE_URL}/api_web/v1/item`;

// A real browser identity keeps the request looking legitimate.
export const JIJI_API_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
};
