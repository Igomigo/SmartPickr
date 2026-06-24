// Old Playwright-based Jiji scraper (kept for easy revert — see scrapers/jiji).
// import jijiScraper from "../scrapers/jiji";
import jijiApiScraper from "../scrapers/jiji-api";

// ========== types ============
export type MapperI = Record<string, any>;

// Swap: route "jiji" through the JSON-API scraper (no headless browser).
// To revert, restore the import above and use `jijiScraper` here.
export const mapper: MapperI = { "jiji": jijiApiScraper };