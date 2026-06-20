import browser from "../../utils/browser";
import { logger } from "../../utils/logger";
import ScraperBase from "../BaseScraper";
import { getSearchResultProductLinks } from "../shared/getSearchResultProductLinks";
import { Product, SearchResultLinks } from "../types";
import { SEARCH_RESULT_CARDS_SELECTOR } from "./constants/selectors";
import { BASE_URL } from "./constants/urls";
import { buildSearchUrl } from "./helpers/buildUrls";
import { getProductDetails } from "./helpers/getProductDetails";

class JumiaScraper extends ScraperBase {
  public async scrapeProductPage(url: string): Promise<Product> {
    // Create a new page (browser is reused across the search, closed by the orchestrator)
    const page = await browser.newPage();
    try {
      logger.log(`[jumia] starting to scrape the product page...`);
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
    } finally {
      await page.close();
    }
  }

  public async scrapeSearchResults({
    searchTerm,
    searchURL,
  }: {
    searchTerm?: string;
    searchURL?: string;
  }): Promise<SearchResultLinks[]> {
    // Create a new page (browser is reused across the search, closed by the orchestrator)
    const page = await browser.newPage();
    try {
      // Construct search url if provided
      let url: string = "";
      if (searchTerm) {
        url = buildSearchUrl(searchTerm);
      } else if (searchURL) {
        url = searchURL;
      }
      // Navigate to the page
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Scrape search results
      const data = {
        page,
        baseUrl: BASE_URL,
        selector: SEARCH_RESULT_CARDS_SELECTOR,
      };
      const searchResults: SearchResultLinks[] =
        await getSearchResultProductLinks(data);
      logger.log(JSON.stringify(searchResults, null, 2));
      return searchResults;
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      throw new Error(
        `An error occured while scraping the search results page - ${error}`,
      );
    } finally {
      await page.close();
    }
  }
}

export default new JumiaScraper();
