import { Page } from "playwright";
import { SearchResultLinks } from "../types";
import { logger } from "../../utils/logger";

export const getSearchResultProductLinks = async ({
  page,
  baseUrl,
  selector,
}: {
  page: Page;
  baseUrl: string;
  selector: string;
}) => {
  // Diagnostic: what did the page actually serve? (catches geo-redirects /
  // block pages where the URL or content differs from a normal browser.)
  const matchCount = await page.locator(selector).count();
  logger.log(
    `[search] final url: ${page.url()} | title: "${await page.title()}" | "${selector}" matched ${matchCount}`,
  );

  // Extract product listings links
  const productLinks: SearchResultLinks[] = await page
    .locator(selector)
    .evaluateAll((els) =>
      els.map((el) => {
        const link = el.getAttribute("href");
        return { link };
      })
    );

  // Clean the urls
  const fullLinks: SearchResultLinks[] = productLinks
    .filter(Boolean)
    .map((item) => {
      const fullLink = new URL(item.link, baseUrl).href;
      return { link: fullLink };
    });

  return fullLinks;
};
