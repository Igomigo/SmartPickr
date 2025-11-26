import { CheerioAPI } from "crawlee";
import { logger } from "../../../utils/logger";
import { getProductSpecs } from "./getProductSpecs";

/**
 * Get the product details from the product page
 * @param $ - The CheerioAPI instance
 * @returns {Promise<Product>} The product details
 * @description
 * This function gets the product details from the product page.
 * The product details include the product image(s), title, price, specs, and description.
 */
export const getProductDetails = async ($: CheerioAPI) => {
  try {
    // Get the product image(s)
    const productImages = $("img.b-slider-image").map((_, element) => {
      return $(element).attr("src")?.trim() || "";
    }).get() || [];
    // Get the product title
    const productTitle = $(".b-advert-title-inner").text().trim();
    // Get the product price
    const productPrice = $(".qa-advert-price-view-value").text().trim();
    // Get the product specs
    const productSpecs = await getProductSpecs($);
    // Get the product description
    const productDescription = $(".b-advert__description-text span").text().trim();
    // Return the product details
    return {
      productImages,
      productTitle,
      productPrice,
      productSpecs,
      productDescription,
    };
  } catch (error) {
    logger.error(`Error getting product details: ${(error as Error).message}`);
    throw error;
  }
};
