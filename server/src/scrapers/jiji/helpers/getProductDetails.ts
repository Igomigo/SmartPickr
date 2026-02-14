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
} from "../constants/jijiCssSelectors";
import { Product } from "../types";

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
};

export const getProductDetails = async (page: Page): Promise<Product> => {
  return await page.evaluate((selectors) => {
    // Extract Actual product items
    const productTitle =
      document
        .querySelector(selectors.PRODUCT_TITLE_SELECTOR)
        ?.textContent?.trim() || "";
    const productPrice =
      document
        .querySelector(selectors.PRODUCT_PRICE_SELECTOR)
        ?.textContent?.trim() || "";
    const productDescription =
      document
        .querySelector(selectors.PRODUCT_DESCRIPTION_SELECTOR)
        ?.textContent?.trim() || "";
    const productImages = Array.from(
      document.querySelectorAll(selectors.PRODUCT_IMAGES_SELECTOR),
    )
      .map((el) => el.getAttribute("src")?.trim() || "")
      .filter((src) => src !== "");

    // Get full product specs
    const productSpecs: Record<string, string> = {};
    const specs = [
      ...document.querySelectorAll(selectors.PRODUCT_SPECS_SELECTOR),
      ...document.querySelectorAll(selectors.PRODUCT_SPECS_SELECTOR_EXTRA),
    ];

    specs.forEach((el) => {
      const key =
        el
          .querySelector(selectors.PRODUCT_SPECS_SELECTOR_KEY)
          ?.textContent.trim() || "";
      const value =
        el
          .querySelector(selectors.PRODUCT_SPEC_SELECTOR_VALUE)
          ?.textContent.trim() || "";

      if (key) {
        productSpecs[key] = value;
      }
    });

    // Return the product details
    return {
      productTitle,
      productPrice,
      productImages,
      productDescription,
      productSpecs
    };
  }, selectors);
};
