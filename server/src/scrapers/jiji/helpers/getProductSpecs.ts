import { CheerioAPI } from "crawlee";
import { logger } from "../../../utils/logger";

/**
 * Get the detailed product specs from the product page
 * @param $ - The CheerioAPI instance
 * @returns {Promise<Record<string, string>>} The product specs
 * @description
 * This function gets the detailed product specs from the product page.
 * The product specs are stored in a record of key-value pairs.
 */
export const getProductSpecs = async ($: CheerioAPI) => {
  try {
    const productSpecs: Record<string, string> = {};
    // Get initial product specs
    $(".b-advert-item-details-collapser__visible div.b-advert-attribute").each(
      (_, element) => {
        const key = $(element).find(".b-advert-attribute__key").text().trim();
        const value = $(element)
          .find(".b-advert-attribute__value")
          .text()
          .trim();
        productSpecs[key] = value;
      }
    );

    logger.log(`Initial product specs: ${JSON.stringify(productSpecs, null, 2)}`);

    // Get additional product specs if they exist
    $(
      ".b-advert-item-details-collapser__rest-wrapper div.b-advert-attribute"
    ).each((_, element) => {
      const key = $(element).find(".b-advert-attribute__key").text().trim();
      const value = $(element).find(".b-advert-attribute__value").text().trim();
      productSpecs[key] = value;
    });

    logger.log(`Additional product specs: ${JSON.stringify(productSpecs, null, 2)}`);

    return productSpecs;
  } catch (error) {
    logger.error(
      `Error getting detailed product specs: ${(error as Error).message}`
    );
    throw error;
  }
};
