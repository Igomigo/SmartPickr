import { Browser, Page } from "playwright";
import browser from "../utils/browser";
import { logger } from "../utils/logger";
import { Product, SearchResultLinks } from "./jiji/types";

abstract class ScraperBase {
  constructor() {}

  protected async createPageContext(): Promise<{
    browserInstance: Browser;
    page: Page;
  }> {
    logger.log("Extracting browser instance and page contexts...");
    return await browser.initializeBrowser();
  }

  abstract scrapeProductPage(url: string): Promise<Product>;

  abstract scrapeSearchResults({
    searchTerm,
    searchURL,
  }: {
    searchTerm?: string;
    searchURL?: string;
  }): Promise<SearchResultLinks[]>;

  public async scrapeProductsBySearch({ searchTerm }: { searchTerm?: string }) {
    try {
      // Extract search result product links
      if (!searchTerm) throw new Error("Search term not provided");
      const productLinks: SearchResultLinks[] = await this.scrapeSearchResults({
        searchTerm,
      });
      // Iterate through each link and extract details from the respective product pages
      const productDetails: Product[] = [];
      for (const linkObj of productLinks) {
        if (linkObj) {
          const result: Product = await this.scrapeProductPage(linkObj.link);
          productDetails.push(result);
          //await browser.closeBrowser();
        }
      }
      return productDetails;
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      throw new Error(
        `An error occured while scraping products by search - ${error}`,
      );
    }
  }
}

export default ScraperBase
