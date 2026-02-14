import { Page } from "playwright";
import {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_SPECS_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
  PRODUCT_SPECS_SELECTOR_KEY,
  PRODUCT_SPEC_SELECTOR_VALUE,
  PRODUCT_SPECS_SELECTOR_EXTRA,
  PRODUCT_REVIEWS_SELECTOR,
  PRODUCT_REVIEWS_CARD_SELECTOR,
  PRODUCT_REVIEWER_COMMENT_SELECTOR,
} from "../constants/selectors";
import { Product, Review } from "../types";

// Organize the selectors
const selectors = {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
  PRODUCT_SPECS_SELECTOR,
  PRODUCT_SPECS_SELECTOR_KEY,
  PRODUCT_SPEC_SELECTOR_VALUE,
  PRODUCT_SPECS_SELECTOR_EXTRA,
  PRODUCT_REVIEWS_SELECTOR,
};

export const getProductDetails = async (page: Page): Promise<Product> => {
  // Step 1: Extract product details and review link from the current page
  // We use page.evaluate to run code in the browser context
  const { details, reviewLinkHref } = await page.evaluate((selectors) => {
    // Helper to safely get text
    const getText = (selector: string) =>
      document.querySelector(selector)?.textContent?.trim() || "";

    // Extract Actual product items
    const productTitle = getText(selectors.PRODUCT_TITLE_SELECTOR);
    const productPrice = getText(selectors.PRODUCT_PRICE_SELECTOR);
    const productDescription = getText(selectors.PRODUCT_DESCRIPTION_SELECTOR);

    const productImages = Array.from(
      document.querySelectorAll(selectors.PRODUCT_IMAGES_SELECTOR),
    )
      .map((el) => el.getAttribute("src")?.trim() || "")
      .filter((src) => src !== "");

    // Extract full product specs
    const productSpecs: Record<string, string> = {};
    const specs = [
      ...document.querySelectorAll(selectors.PRODUCT_SPECS_SELECTOR),
      ...document.querySelectorAll(selectors.PRODUCT_SPECS_SELECTOR_EXTRA),
    ];

    specs.forEach((el) => {
      const key =
        el
          .querySelector(selectors.PRODUCT_SPECS_SELECTOR_KEY)
          ?.textContent?.trim() || "";
      const value =
        el
          .querySelector(selectors.PRODUCT_SPEC_SELECTOR_VALUE)
          ?.textContent?.trim() || "";

      if (key) {
        productSpecs[key] = value;
      }
    });

    // Extract Review Link Href if it exists
    const reviewLinkEl = document.querySelector(
      selectors.PRODUCT_REVIEWS_SELECTOR,
    );
    const reviewLinkHref = reviewLinkEl?.getAttribute("href");

    return {
      details: {
        productTitle,
        productPrice,
        productImages,
        productDescription,
        productSpecs,
      },
      reviewLinkHref,
    };
  }, selectors);

  // Step 2: Handle Reviews (Node.js context)
  let reviews: Review[] = [];
  if (reviewLinkHref) {
    try {
      // Navigate to reviews page
      // Ensure we have a full URL
      const fullReviewUrl = new URL(reviewLinkHref, page.url()).href;
      await page.goto(fullReviewUrl);
      await page.waitForLoadState("domcontentloaded");

      const reviewsData = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(PRODUCT_REVIEWS_CARD_SELECTOR),
        ).map((el) => {
          const comment =
            document
              .querySelector(PRODUCT_REVIEWER_COMMENT_SELECTOR)
              ?.textContent.trim() || "";

          return { comment };
        });
      });

      reviews = reviewsData;
    } catch (error) {
      console.error("Error navigating to reviews page:", error);
    }
  }

  // Return the product details
  return {
    ...details,
    productReviews: reviews,
  };
};
