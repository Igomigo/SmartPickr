import { mapper } from "../config/platformRegistry";
import { Product, SearchResultLinks } from "../scrapers/types";
import { logger } from "../utils/logger";
// Browser no longer used — the jiji-api scraper hits the JSON API directly (no
// headless Chromium). Kept commented for the Playwright path (see scrapers/jiji).
// import browser from "../utils/browser";

// ========== main class ===========
class Orchestrator {
  private logger;

  constructor() {
    this.logger = logger;
  }

  public async orchestrate(
    searchTerm: string,
    platforms: string[],
    onStatus: (s: string) => void,
    onProduct: (obj: Product) => void,
    shouldStop: () => boolean = () => false,
  ) {
    const products: Product[] = [];

    for (const p of platforms) {
        if (shouldStop()) break; // If system is stopped, then it should stop scraping
        onStatus(`Searching for ${searchTerm} on ${p}...`);
        const scraperInstance = mapper[p as string];
        if (!scraperInstance) {
          this.logger.error(`No scraper for platform ${p}`);
          continue;
        }
        const productLinks: SearchResultLinks[] =
          await scraperInstance.scrapeSearchResults({ searchTerm });
        const productLinksLength: number = productLinks.length;
        onStatus(`Found ${productLinksLength} listings - pulling details...`);
        for (const [index, productLink] of productLinks.entries()) {
          if (shouldStop()) break;
          try {
            onStatus(
              `Checking listing ${index + 1} of ${productLinksLength}...`,
            );
            const productDetails: Product =
              await scraperInstance.scrapeProductPage(productLink.link);
            // The scraper sets the canonical productPageUrl itself; don't
            // overwrite it with productLink.link (which is a guid for jiji-api).
            onProduct(productDetails);
            products.push(productDetails);
          } catch (error) {
            this.logger.error(
              `An error occured while scraping product page for - "${productLink.link}"`,
            );
          }
        }
      }
    return products;
  }
}

export default new Orchestrator();
