import { CheerioAPI } from "crawlee";
import { logger } from "../../../utils/logger";

export const getReviewsUrlPath = async ($: CheerioAPI) => {
  try {
    const reviewsUrlPath = $(
      ".b-seller-advert-info__last-feedback a.b-seller-advert-info__last-feedback__link"
    )
      .attr("href")
      ?.trim()

    logger.log(`Reviews URL path: ${reviewsUrlPath}`);
    
    return reviewsUrlPath;
  } catch (error) {
    logger.error(`Error getting reviews URL path: ${(error as Error).message}`);
    throw error;
  }
};
