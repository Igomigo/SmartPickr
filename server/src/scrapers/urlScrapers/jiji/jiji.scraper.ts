import { CheerioCrawler } from "crawlee";

class JijiScraper {
    constructor() {}

    private async getScraper() {
        const scraper = new CheerioCrawler({
            requestHandler: async ({ $, request}) => {}
        });

        return scraper;
    }

    public async runScraper(url: string) {
        const scraper = await this.getScraper();
        await scraper.addRequests([ url ]);
        await scraper.run();
    }
}