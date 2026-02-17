import { Browser, Page } from "playwright";
import browser from "../../utils/browser";
import { logger } from "../../utils/logger";
import { Product } from "./types";
import { getProductDetails } from "./helpers/getProductDetails";

class JijiScraper {
  constructor() {}

  private async getContext(): Promise<{
    browserInstance: Browser;
    page: Page;
  }> {
    logger.log("Extracting browser instance and page");
    return await browser.initializeBrowser();
  }

  public async scrapeProductPage(url: string) {
    try {
      // Extract the browser page context
      const { page } = await this.getContext();
      logger.log(`[jiji] starting to scrape the product page...`);
      // Go to the page
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const productDetails: Product = await getProductDetails(page);
      logger.log(JSON.stringify(productDetails, null, 2));
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
    }
  }

  public async scrapeSearchResults() {
    try {
      // 
    } catch (error) {
      
    }
  }
}

export default new JijiScraper();
