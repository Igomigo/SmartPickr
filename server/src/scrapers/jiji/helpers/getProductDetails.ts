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
  // Step 1: Extract product details from current page
  // Wait for the deepest stable section of the page before extraction.
  await page.locator(PRODUCT_SPECS_SELECTOR).first().waitFor();
  // Helper to safely get text
  const getText = async (selector: string) => {
    return (await page.locator(selector)?.textContent())?.trim() || "";
  };
  const productTitle = await getText(PRODUCT_TITLE_SELECTOR);
  const productPrice = await getText(PRODUCT_PRICE_SELECTOR);
  const productDescription = await getText(PRODUCT_DESCRIPTION_SELECTOR);
  const productImages = await page
    .locator(PRODUCT_IMAGES_SELECTOR)
    .evaluateAll((els) => {
      return els
        .map((el) => el.getAttribute("src")?.trim() || "")
        .filter((src) => src !== "");
    });
  const productSpecs = await page
    .locator(
      `${selectors.PRODUCT_SPECS_SELECTOR}, ${selectors.PRODUCT_SPECS_SELECTOR_EXTRA}`,
    )
    .evaluateAll(
      (els, selector) => {
        const specs: Record<string, string> = {};
        els.forEach((el) => {
          const key = el.querySelector(selector.key)?.textContent?.trim() || "";
          const value =
            el.querySelector(selector.value)?.textContent?.trim() || "";

          // Populate the specs list
          specs[key] = value;
        });

        return specs;
      },
      {
        key: selectors.PRODUCT_SPECS_SELECTOR_KEY,
        value: selectors.PRODUCT_SPEC_SELECTOR_VALUE,
      },
    );

  const details: Product = {
    productTitle,
    productPrice,
    productImages,
    productDescription,
    productSpecs,
  };

  // Step 2: Handle Reviews (Node.js context)
  let productReviews: Review[] = [];
  // Check if view all button exists
  const viewAllButton = page.locator(selectors.PRODUCT_REVIEWS_SELECTOR);
  if ((await viewAllButton.count()) > 0) {
    await viewAllButton.click();
    // Extract reviews cards
    const comments: Review[] = await page
      .locator(selectors.PRODUCT_REVIEWS_CARD_SELECTOR)
      .evaluateAll(
        (els, selectors) => {
          return els.map((el) => {
            const comment =
              el
                .querySelector(selectors.comment_selector)
                ?.textContent.trim() || "";
            return { comment };
          });
        },
        {
          comment_selector: selectors.PRODUCT_REVIEWER_COMMENT_SELECTOR,
        },
      );
    productReviews = comments;
  }

  // Return the product details
  return {
    ...details,
    productReviews,
  };
};
