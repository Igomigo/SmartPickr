import { CheerioAPI } from "crawlee";
import { logger } from "../../../utils/logger";
import { getProductSpecs } from "./getProductSpecs";

export const getProductDetails = async ($: CheerioAPI) => {
  try {
    // Get the product image(s)
    const productImages = $("img.b-advert-image-list__image").map((_, element) => {
      return $(element).attr("src")?.trim() || "";
    }).get() || [];
    // Get the product title
    const productTitle = $(".b-advert-title-inner").text().trim();
    // Get the product price
    const productPrice = $(".qa-advert-price-view-value").text().trim();
    // Get the product specs
    const productSpecs = await getProductSpecs($);
    // Return the product details
    return {
      productImages,
      productTitle,
      productPrice,
      productSpecs,
    };
  } catch (error) {
    logger.error(`Error getting product details: ${(error as Error).message}`);
    throw error;
  }
};
