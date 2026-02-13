import { Page } from "playwright";
import {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
} from "../constants/jijiCssSelectors";
import { Product } from "../types";

// Organize the selectors
const selectors = {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
};

export const getProductDetails = async (page: Page): Promise<Product> => {
  return await page.evaluate((selectors) => {
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

    // Return the product details
    return {
      productTitle,
      productPrice,
      productImages,
      productDescription,
    };
  }, selectors);
};
