import { CheerioCrawler, Request } from "crawlee";
import { logger } from "../../utils/logger";
import getSearchUrl from "./helpers/getUrl";
import { getProductDetails } from "./helpers/getProductDetails";

class JijiScraper {
  constructor() {}

  private async createCrawler(requestHandler: any): Promise<CheerioCrawler> {
    return new CheerioCrawler({
      requestHandler,
    });
  }

  private async scrapeProductPage() {
    try {
      const requestHandler = async ({
        $,
        request,
      }: {
        $: any;
        request: Request;
      }) => {
        logger.log(`Scraping ${request.url}...`);

        // Scrape the product page
        const productDetails = await getProductDetails($);
        logger.log(`Product details: ${JSON.stringify(productDetails)}`);
        return productDetails;
      };

      // Create a crawler for the request handler
      const crawler = await this.createCrawler(requestHandler);
      return crawler;
    } catch (error) {
      logger.error(`Error scraping product page: ${(error as Error).message}`);
      throw error;
    }
  }

  private async scrapeSearchResultsPage() {
    try {
      const requestHandler = async ({
        $,
        request,
        crawler,
      }: {
        $: any;
        request: Request;
        crawler: CheerioCrawler;
      }) => {
        logger.log(`Scraping ${request.url}...`);
      };

      // Create a crawler for the request handler
      const crawler = await this.createCrawler(requestHandler);
      return crawler;
    } catch (error) {
      logger.error(
        `Error scraping search results page: ${(error as Error).message}`
      );
      throw error;
    }
  }

  public async scrapeJiji({
    url,
    searchText,
  }: {
    url?: string;
    searchText?: string;
  }) {
    try {
      let crawler: CheerioCrawler;
      if (url) {
        crawler = await this.scrapeProductPage();
        await crawler.addRequests([{ url }]);
      } else if (searchText) {
        crawler = await this.scrapeSearchResultsPage();
        await crawler.addRequests([
          { url: getSearchUrl(searchText), label: "START_URL" },
        ]);
      } else {
        throw new Error("No URL or search text provided");
      }
      await crawler?.run();
    } catch (error) {
      logger.error(`Error scraping Jiji: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default new JijiScraper();
