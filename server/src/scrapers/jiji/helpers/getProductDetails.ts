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
  PRODUCT_REVIEWS_CARD_SELECTOR,
  PRODUCT_REVIEWER_COMMENT_SELECTOR,
};

export const getProductDetails = async (page: Page): Promise<Product> => {
  // Step 1: Extract product details from the current page
  // We use page.evaluate to run code in the browser context
  const details = await page.evaluate((selectors) => {
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

    return {
      productTitle,
      productPrice,
      productImages,
      productDescription,
      productSpecs,
    };
  }, selectors);

  // Step 2: Handle Reviews (Node.js context)
  let productReviews: Review[] = [];
  // Check if view all button exists
  const viewAllButton = page.locator(selectors.PRODUCT_REVIEWS_SELECTOR);
  if ((await viewAllButton.count()) > 0) {
    await viewAllButton.click();
    // wait for a few seconds for page to load
    await page.waitForSelector(selectors.PRODUCT_REVIEWS_CARD_SELECTOR, {
      timeout: 10000,
    });
    // Extract reviews cards
    const reviewCards = page.locator(selectors.PRODUCT_REVIEWS_CARD_SELECTOR);
    const count = await reviewCards.count();

    for (let i = 0; i < count; i++) {
      const card = reviewCards.nth(i);
      const comment = await card
        .locator(selectors.PRODUCT_REVIEWER_COMMENT_SELECTOR)
        .first()
        .textContent();

      productReviews.push({
        comment: comment?.trim() || "",
      });
    }
  }

  // Return the product details
  return {
    ...details,
    productReviews,
  };
};
