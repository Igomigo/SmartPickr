import { mapper } from "../config/platformRegistry";
import { Product, SearchResultLinks } from "../scrapers/types";
import { logger } from "../utils/logger";

// ========== types ============
export type mapperI = Record<string, any>;

// ========== main class ===========
class Orchestrator {
    private logger;

    constructor() {
        this.logger = logger
    }

    public async orchestrate(
        searchTerm: string,
        platforms: string[],
        onStatus: (s: string) => void,
        onProduct: (obj: Product) => void
    ) {
        const products: Product[] = [];

        for (const p of platforms) {
            onStatus(`Searching for ${searchTerm} on ${p}...`);
            const scraperInstance = mapper[p as string];
            if (!scraperInstance) {
                this.logger.error(`No scraper for platform ${p}`);
                continue;
            }
            const productLinks: SearchResultLinks[] = await scraperInstance.scrapeSearchResults(
                { searchTerm }
            );
            const productLinksLength: number = productLinks.length;
            onStatus(`Found ${productLinksLength} listings - pulling details...`);
            for (const [index, productLink] of productLinks.entries()) {
                try {
                    onStatus(`Checking listing ${index + 1} of ${productLinksLength}...`);
                    const productDetails: Product = await scraperInstance.scrapeProductPage(productLink.link);
                    productDetails.productPageUrl = productLink.link;
                    onProduct(productDetails);
                    products.push(productDetails);
                } catch (error) {
                    this.logger.error(`An error occured while scraping product page for - "${productLink.link}"`);
                }
            }
        }
        return products;
    }
}

export default new Orchestrator();