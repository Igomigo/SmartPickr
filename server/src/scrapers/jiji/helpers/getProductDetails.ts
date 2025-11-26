import { CheerioAPI } from "crawlee";
import { logger } from "../../../utils/logger";

export const getProductDetails = async ($: CheerioAPI) => {
  try {
    const productTitle = $(".b-advert-title-inner").text().trim();
    const productPrice = $(".qa-advert-price-view-value").text().trim();
  } catch (error) {
    logger.error(`Error getting product details: ${(error as Error).message}`);
    throw error;
  }
};
