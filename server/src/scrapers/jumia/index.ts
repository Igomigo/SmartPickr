import { logger } from "../../utils/logger";
import ScraperBase from "../BaseScraper";
import { getSearchResultProductLinks } from "../shared/getSearchResultProductLinks";
import { Product, SearchResultLinks } from "../types";
import { SEARCH_RESULT_CARDS_SELECTOR } from "./constants/selectors";
import { BASE_URL } from "./constants/urls";
import { buildSearchUrl } from "./helpers/buildUrls";

class JumiaScraper extends ScraperBase {
  public async scrapeProductPage(url: string): Promise<Product> {
    throw new Error("Not implemented yet");
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
    }
  }
}
