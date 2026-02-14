/**
 * Test the browser connection setup in headless mode
 */

import jiji from "../scrapers/jiji";

const url =
  "https://jiji.ng/ikeja/tablets/new-macpad-air-m5-ultra-1-tb-aJS4sPpbl8iTNgFgENeVm7Ha.html?page=1&pos=16&cur_pos=16&ads_per_page=26&lid=r-oxgcApW5SQrOuVEs&indexPosition=15";

const scrapeProduct = async () => {
  await jiji.scrapeProductPage(url);
};

scrapeProduct();
