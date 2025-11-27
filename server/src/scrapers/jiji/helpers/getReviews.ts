import { logger } from "../../../utils/logger";
import { JIJI_REVIEWS_ENDPOINT } from "../../../constants";
import { JijiReviewsApiResponse, Review } from "../types";

/**
 * Get the reviews from the reviews page
 * @param path - The path to the reviews page
 * @returns {Promise<Review[]>} The reviews
 * @description
 * This function gets the reviews from the reviews API endpoint.
 * The reviews are returned as an array of Review objects.
 */
export const getReviews = async (path: string) => {
  try {
    // Construct the reviews API URL
    const reviewsAPIUrl = `${JIJI_REVIEWS_ENDPOINT}${path}/1.json?reply_limit=2`;

    logger.log(`Fetching reviews from ${reviewsAPIUrl}...`);

    // Fetch the reviews from the API
    const response = await fetch(reviewsAPIUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    // Parse the response as JSON
    const data: JijiReviewsApiResponse = await response.json();

    // Check if API returned successfully
    if (data.status !== "ok") {
      logger.error(`Failed to fetch reviews: ${data.status}`);
      return [];
    }

    // Map the results to the Review type
    const reviews: Review[] = data.results.map((result) => ({
      reviewerName: result.user_name,
      comment: result.comment,
      rating: result.rating,
      stars: result.stars,
    }));

    // Log the reviews
    logger.log(`Found ${reviews.length} reviews`);
    logger.log(JSON.stringify(reviews, null, 2));

    return reviews;
  } catch (error) {
    logger.error(`Error getting reviews: ${(error as Error).message}`);
    throw error;
  }
};
