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
import { Product, Review } from "../../types";
import { getText } from "../../shared/getTextContentFromHtml";

// Organize the selectors
const selectors = {
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
  const productTitle = await getText(page, PRODUCT_TITLE_SELECTOR);
  const productPrice = await getText(page, PRODUCT_PRICE_SELECTOR);
  const productDescription = await getText(page, PRODUCT_DESCRIPTION_SELECTOR);
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

  // Step 2: Handle Reviews (best-effort).
  // Reviews are secondary, so a failure here must never discard the whole
  // product. Some listings have a "view all" button but the feedback panel
  // never renders the expected element — fail fast (don't hang 30s) and just
  // return the product without reviews.
  let productReviews: Review[] = [];
  try {
    // Check if view all button exists
    const viewAllButton = page.locator(selectors.PRODUCT_REVIEWS_SELECTOR);
    if ((await viewAllButton.count()) > 0) {
      await Promise.all([
        page.waitForLoadState("domcontentloaded"),
        viewAllButton.click(),
      ]);
      await page
        .locator(selectors.PRODUCT_REVIEWS_CARD_SELECTOR)
        .first()
        .waitFor({ state: "visible", timeout: 12000 });
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
  } catch {
    // Reviews panel didn't render in time — proceed with the product anyway.
    // Logged (not silent) so we can spot listings whose reviews we're missing.
    console.warn(
      `[jiji] reviews panel didn't render in time for "${productTitle}" — keeping product without reviews`,
    );
    productReviews = [];
  }

  // Return the product details
  return {
    ...details,
    productReviews,
  };
};
