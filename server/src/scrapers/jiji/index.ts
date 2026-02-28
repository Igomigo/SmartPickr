import { Browser, Page } from "playwright";
import browser from "../../utils/browser";
import { logger } from "../../utils/logger";
import { Product, SearchResultLinks } from "./types";
import { getProductDetails } from "./helpers/getProductDetails";
import { buildSearchUrl } from "./helpers/buildUrls";
import { getSearchDetails } from "./helpers/getSearchResultDetails";
import ScraperBase from "../BaseScraper";

class JijiScraper extends ScraperBase {

  public async scrapeProductPage(url: string): Promise<Product> {
    try {
      // Extract the browser page context
      const { page } = await this.createPageContext();
      logger.log(`[jiji] starting to scrape the product page...`);
      // Go to the page
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const productDetails: Product = await getProductDetails(page);
      logger.log(JSON.stringify(productDetails, null, 2));
      return productDetails;
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      throw new Error(
        `An error occured while scraping the product page - ${error}`,
      );
    }
  }

  public async scrapeSearchResults({
    searchTerm,
    searchURL,
  }: {
    searchTerm?: string;
    searchURL?: string;
  }): Promise<SearchResultLinks[]> {
    try {
      // Construct search url if provided
      let url: string = "";
      if (searchTerm) {
        url = buildSearchUrl(searchTerm);
      } else if (searchURL) {
        url = searchURL;
      }
      // Navigate to the page
      const { page } = await this.createPageContext();
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Scrape search results
      const searchResults: SearchResultLinks[] = await getSearchDetails(page);
      logger.log(JSON.stringify(searchResults, null, 2));
      return searchResults;
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      throw new Error(
        `An error occured while scraping the search results page - ${error}`,
      );
    }
  }
}

export default new JijiScraper();
