import { Page } from "playwright";
import {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
  PRODUCT_REVIEWS_SELECTOR,
  PRODUCT_REVIEWS_CARD_SELECTOR,
  PRODUCT_REVIEWER_COMMENT_SELECTOR,
} from "../constants/selectors";
import { Product, Review } from "../../types";
import { getText } from "../../shared/getTextContentFromHtml";

// Organize the selectors
const selectors = {
  PRODUCT_DESCRIPTION_SELECTOR,
  PRODUCT_IMAGES_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
  PRODUCT_REVIEWS_SELECTOR,
  PRODUCT_REVIEWS_CARD_SELECTOR,
  PRODUCT_REVIEWER_COMMENT_SELECTOR,
};

export const getProductDetails = async (page: Page) => {
  // Await the deepest stable section of the paghe before extraction
  await page.locator(PRODUCT_DESCRIPTION_SELECTOR).first().waitFor();
  console.log("")
  const productTitle = await getText(page, PRODUCT_TITLE_SELECTOR);
  const productPrice = await getText(page, PRODUCT_PRICE_SELECTOR);
  const productDescription = await page
    .locator(PRODUCT_DESCRIPTION_SELECTOR)
    .evaluateAll((els) => {
      return els
        .map((el) => el.textContent?.trim())
        .filter((text) => text)
        .join("\n");
    });
  const productImages = await page
    .locator(PRODUCT_IMAGES_SELECTOR)
    .evaluateAll((els) => {
      return els
        .map((el) => el.getAttribute("src")?.trim() || "")
        .filter((src) => src !== "");
    });

  const details: Product = {
    productTitle,
    productPrice,
    productImages,
    productDescription,
  };

  return details;
};
