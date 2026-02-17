import { Page } from "playwright";
import { SearchResultLinks } from "../types";
import { SEARCH_RESULT_CARDS_SELECTOR } from "../constants/selectors";
import { BASE_URL } from "../constants/urls";

export const getSearchDetails = async (page: Page) => {
  // Extract product listings links
  const productLinks: SearchResultLinks[] = await page
    .locator(SEARCH_RESULT_CARDS_SELECTOR)
    .evaluateAll((els) => {
      return els.map((el) => {
        const link = el.getAttribute("href");
        return { link };
      });
    });

  // Clean the urls
  const fullLinks: SearchResultLinks[] = productLinks.filter(Boolean).map((link) => {
    const fullLink = new URL(link, BASE_URL).href;
    return { link: fullLink };
  });

  return fullLinks;
};
