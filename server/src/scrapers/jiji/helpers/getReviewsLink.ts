import { CheerioAPI } from "crawlee";
import { logger } from "../../../utils/logger";

export const getReviewsLink = async ($: CheerioAPI) => {
  try {
    const reviewsLink = $(
      ".b-seller-advert-info__last-feedback a.b-seller-advert-info__last-feedback__link"
    )
      .attr("href")
      ?.trim()
    return reviewsLink;
  } catch (error) {
    logger.error(`Error getting reviews link: ${(error as Error).message}`);
    throw error;
  }
};
