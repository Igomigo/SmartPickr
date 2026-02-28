/**
 * Test the browser connection setup in headless mode
 */

import jiji from "../scrapers/jiji";

// const url =
//   "https://jiji.ng/mushin/shoes/bottega-veneta-chunky-boat-shoes-size-40-46-dvLP2p5u9hdIG0b54BnZGBGA.html?page=1&pos=7&cur_pos=7&ads_per_page=24&ads_count=31977&lid=DK10XRxJnDEtMR--&indexPosition=6";

const searchTerm = "samsung phone s23";

const scrapeProduct = async () => {
  await jiji.scrapeProductsBySearch({ searchTerm });
};

scrapeProduct();
