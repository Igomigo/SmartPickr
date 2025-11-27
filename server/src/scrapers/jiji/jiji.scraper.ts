import { CheerioCrawler, Request } from "crawlee";
import { logger } from "../../utils/logger";
import getSearchUrl from "./helpers/getUrl";
import { getProductDetails } from "./helpers/getProductDetails";
import { getReviews } from "./helpers/getReviews";
import { getReviewsLink } from "./helpers/getReviewsLink";
import { Product } from "./types";

class JijiScraper {
  constructor() {}

  private async createCrawler(requestHandler: any): Promise<CheerioCrawler> {
    return new CheerioCrawler({
      requestHandler,
    });
  }

  public async scrapeProductPage(url: string): Promise<Product> {
    try {
      let productDetails: Partial<Product> = {};
      const requestHandler = async ({
        $,
        request,
      }: {
        $: any;
        request: Request;
      }) => {
        logger.log(`Scraping ${request.url}...`);

        // Scrape the product page
        const details = await getProductDetails($);
        logger.log(`Product details: ${JSON.stringify(details, null, 2)}`);
        productDetails = { ...productDetails, ...details };

        // Extract reviews link and get reviews
        const reviewsPath: string | undefined = await getReviewsLink($);
        if (reviewsPath) {
          try {
            const reviews = await getReviews(reviewsPath);
            productDetails.reviews = reviews;
          } catch (error) {
            logger.error(`Error getting reviews: ${(error as Error).message}`);
            productDetails.reviews = [];
          }
        }

        return productDetails;
      };

      // Create a crawler for the request handler
      const crawler = await this.createCrawler(requestHandler);
      await crawler.addRequests([{ url }]);
      await crawler.run();
      
      // Normalize to a full ready product object
      const product: Product = {
        ...productDetails,
        productImages: productDetails.productImages || [],
        productTitle: productDetails.productTitle || "",
        productPrice: productDetails.productPrice || "",
        productSpecs: productDetails.productSpecs || {},
        productDescription: productDetails.productDescription || "",
        reviews: productDetails.reviews || [],
      };
      return product;
    } catch (error) {
      logger.error(`Error scraping product page: ${(error as Error).message}`);
      throw error;
    }
  }

  public async scrapeSearchResultsPage() {
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

}

export default new JijiScraper();
