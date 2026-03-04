/**
 * Test the browser connection setup in headless mode
 */

import jiji from "../scrapers/jiji";
import jumia from "../scrapers/jumia";

const url =
  "https://www.jumia.com.ng/fashion-cooperate-business-mens-leather-luxury-wedding-office-formal-shoes-black-226547771.html";

//const searchTerm = "Men shoes";

const scrapeProduct = async () => {
  //await jiji.scrapeProductsBySearch({ searchTerm });
  //await jumia.scrapeSearchResults({ searchTerm });
  await jumia.scrapeProductPage(url);
};

scrapeProduct();
