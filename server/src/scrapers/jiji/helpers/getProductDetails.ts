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
  // Step 1: Extract product details from the current page
  // We use page.evaluate to run code in the browser context
  //   const details = await page.evaluate((selectors) => {
  //     // Helper to safely get text
  //     const getText = (selector: string) =>
  //       document.querySelector(selector)?.textContent?.trim() || "";

  //     // Extract Actual product items
  //     const productTitle = getText(selectors.PRODUCT_TITLE_SELECTOR);
  //     const productPrice = getText(selectors.PRODUCT_PRICE_SELECTOR);
  //     const productDescription = getText(selectors.PRODUCT_DESCRIPTION_SELECTOR);

  //     const productImages = Array.from(
  //       document.querySelectorAll(selectors.PRODUCT_IMAGES_SELECTOR),
  //     )
  //       .map((el) => el.getAttribute("src")?.trim() || "")
  //       .filter((src) => src !== "");

  //     // Extract full product specs
  //     const productSpecs: Record<string, string> = {};
  //     const specs = [
  //       ...document.querySelectorAll(selectors.PRODUCT_SPECS_SELECTOR),
  //       ...document.querySelectorAll(selectors.PRODUCT_SPECS_SELECTOR_EXTRA),
  //     ];

  //     specs.forEach((el) => {
  //       const key =
  //         el
  //           .querySelector(selectors.PRODUCT_SPECS_SELECTOR_KEY)
  //           ?.textContent?.trim() || "";
  //       const value =
  //         el
  //           .querySelector(selectors.PRODUCT_SPEC_SELECTOR_VALUE)
  //           ?.textContent?.trim() || "";

  //       if (key) {
  //         productSpecs[key] = value;
  //       }
  //     });

  //     return {
  //       productTitle,
  //       productPrice,
  //       productImages,
  //       productDescription,
  //       productSpecs,
  //     };
  //   }, selectors);

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
      const comment =
        (
          await card
            .locator(selectors.PRODUCT_REVIEWER_COMMENT_SELECTOR)
            .first()
            .textContent()
        )?.trim() || "";

      productReviews.push({
        comment: comment,
      });
    }
  }

  // Return the product details
  return {
    ...details,
    productReviews,
  };
};
