import { CheerioCrawler } from "crawlee";
import { logger } from "../../../utils/logger";

class JijiScraper {
  constructor() {}

  private async createCrawler() {
    const crawler = new CheerioCrawler({
      requestHandler: async ({ $, request }) => {
        logger.log(`Scraping ${request.url}...`);
      },
    });

    return crawler;
  }

  public async scrapeUrl(url: string) {
    const crawler = await this.createCrawler();
    await crawler.addRequests([{ url }]);
    await crawler.run();
  }
}

export default new JijiScraper();
