import { logger } from "../../utils/logger";
import { Product, SearchResultLinks } from "../types";
import {
  JIJI_BASE_URL,
  JIJI_ITEM_ENDPOINT,
  JIJI_LISTING_ENDPOINT,
} from "./constants";
import { fetchJson } from "./helpers/fetchJson";
import { parseProduct } from "./helpers/parseProduct";
import { JijiItemResponse, JijiListingResponse } from "./types";

/**
 * Jiji scraper backed by Jiji's JSON API (no headless browser).
 *
 * Exposes the SAME interface as the Playwright-based scraper
 * (`scrapeSearchResults` + `scrapeProductPage`) so it's a drop-in replacement
 * in the platform registry / orchestrator.
 */
class JijiApiScraper {
  /**
   * Search → list of product page links (the orchestrator then fetches each).
   * We use the advert `guid` as the canonical id and build a clean page URL.
   */
  public async scrapeSearchResults({
    searchTerm,
  }: {
    searchTerm?: string;
    searchURL?: string;
  }): Promise<SearchResultLinks[]> {
    if (!searchTerm) throw new Error("Search term not provided");

    const url = `${JIJI_LISTING_ENDPOINT}?query=${encodeURIComponent(
      searchTerm.trim(),
    )}&slug=`;

    const data = await fetchJson<JijiListingResponse>(url);
    const adverts = data.adverts_list?.adverts ?? [];

    // Use the guid as the link — scrapeProductPage resolves it via the item API.
    const links: SearchResultLinks[] = adverts
      .filter((a) => a.guid)
      .map((a) => ({ link: a.guid }));

    logger.log(`[jiji-api] found ${links.length} listings`);
    return links;
  }

  /**
   * Resolve one product by its guid (the "link" from scrapeSearchResults).
   */
  public async scrapeProductPage(guid: string): Promise<Product> {
    logger.log(`[jiji-api] fetching product ${guid}...`);

    const data = await fetchJson<JijiItemResponse>(
      `${JIJI_ITEM_ENDPOINT}/${guid}`,
    );

    // Prefer the advert's own canonical url; fall back to a guid-based path.
    const pagePath = data.advert?.url ?? `/${guid}`;
    const productPageUrl = pagePath.startsWith("http")
      ? pagePath
      : `${JIJI_BASE_URL}${pagePath}`;

    return parseProduct(data, productPageUrl);
  }
}

export default new JijiApiScraper();
