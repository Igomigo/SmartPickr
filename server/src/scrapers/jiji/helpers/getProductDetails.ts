import { Page } from "playwright";
import {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
} from "../constants/jijiCssSelectors";
import { Product } from "../types";

export const getProductDetails = async (page: Page): Promise<Product> => {
  return await page.evaluate(
    ({
      PRODUCT_TITLE_SELECTOR,
      PRODUCT_PRICE_SELECTOR,
      PRODUCT_DESCRIPTION_SELECTOR,
      PRODUCT_IMAGES_SELECTOR,
    }) => {
      const productTitle =
        document.querySelector(PRODUCT_TITLE_SELECTOR)?.textContent?.trim() ||
        "";
      const productPrice =
        document.querySelector(PRODUCT_PRICE_SELECTOR)?.textContent?.trim() ||
        "";
      const productDescription =
        document
          .querySelector(PRODUCT_DESCRIPTION_SELECTOR)
          ?.textContent?.trim() || "";
      const productImages = Array.from(
        document.querySelectorAll(PRODUCT_IMAGES_SELECTOR),
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
    },
    {
      PRODUCT_TITLE_SELECTOR,
      PRODUCT_PRICE_SELECTOR,
      PRODUCT_DESCRIPTION_SELECTOR,
      PRODUCT_IMAGES_SELECTOR,
    },
  );
};
