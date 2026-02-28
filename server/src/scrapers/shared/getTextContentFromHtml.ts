import { Page } from "playwright";

export const getText = async (page: Page, selector: string) => {
  return (await page.locator(selector)?.textContent())?.trim() || "";
};
