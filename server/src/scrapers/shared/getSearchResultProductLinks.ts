import { Page } from "playwright";
import { SearchResultLinks } from "../types";

export const getSearchResultProductLinks = async ({
  page,
  baseUrl,
  selector,
}: {
  page: Page;
  baseUrl: string;
  selector: string;
}) => {
  // Extract product listings links
  const productLinks: SearchResultLinks[] = await page
    .locator(selector)
    .evaluateAll((els) => {
      return els.map((el) => {
        const link = el.getAttribute("href");
        return { link };
      });
    });

  // Clean the urls
  const fullLinks: SearchResultLinks[] = productLinks
    .filter(Boolean)
    .map((item) => {
      const fullLink = new URL(item.link, baseUrl).href;
      return { link: fullLink };
    });

  return fullLinks;
};
