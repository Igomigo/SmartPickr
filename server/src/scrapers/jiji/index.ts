import { logger } from "../../utils/logger";
import { Product, SearchResultLinks } from "../types";
import { getProductDetails } from "./helpers/getProductDetails";
import { buildSearchUrl } from "./helpers/buildUrls";
import ScraperBase from "../BaseScraper";
import { getSearchResultProductLinks } from "../shared/getSearchResultProductLinks";
import { BASE_URL } from "./constants/urls";
import { SEARCH_RESULT_CARDS_SELECTOR } from "./constants/selectors";

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
      const data = {
        page,
        baseUrl: BASE_URL,
        selector: SEARCH_RESULT_CARDS_SELECTOR
      }
      const searchResults: SearchResultLinks[] = await getSearchResultProductLinks(data);
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
