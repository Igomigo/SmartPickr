/**
 * Test the browser connection setup in headless mode
 */

import browser from "../utils/browser";
import { JIJI_PRODUCT_URL } from "../constants";

// Types
interface IResult {
  name: string;
  price: string;
}

const run = async () => {
  // launch the browswer
  const { browserInstance, page } = await browser.initializeBrowser();
  // Visit autonoms store
  //await page.goto(JIJI_PRODUCT_URL);
  await page.goto("https://demo-webstore.apify.org/search/on-sale");
  // Data extraction code to extract products info from the page
  console.log("Extracting products from page ...");
  const products = await page.evaluate(() => {
    const productCards = Array.from(
      document.querySelectorAll(".ProductCard_root__HqXTt"),
    );
    // Extract data from each card
    return productCards.map((el) => {
      const name =
        el
          .querySelector(".ProductCard_name__YciuQ span")
          ?.textContent?.trim() || "Unknown";
      const price =
        el.querySelector(".ProductCard_price___JB_V")?.textContent?.trim() ||
        "Unknown";

      return { name, price };
    });
  });
  console.log("Products Extracted successfully ✅");
  console.log(products);
  // Wait for 10 seconds
  await page.waitForTimeout(2000);
  // close the browser
  await browserInstance.close();
};

run();
