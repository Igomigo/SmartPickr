import { logger } from "../../../utils/logger";
import { JIJI_REVIEWS_ENDPOINT } from "../../../constants";

export const getReviews = async (path: string) => {
  try {
    const reviewsAPIUrl = `${JIJI_REVIEWS_ENDPOINT}${path}/1.json?reply_limit=2`;
    const response = await fetch(reviewsAPIUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    const reviews: any[] = [];
    return reviews;
  } catch (error) {
    logger.error(`Error getting reviews: ${(error as Error).message}`);
    throw error;
  }
};
