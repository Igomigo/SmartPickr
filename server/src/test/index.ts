import jijiScraper from "../scrapers/jiji/jiji.scraper";

const testjijiScraper = async () => {
  try {
    const product = await jijiScraper.scrapeProductPage(
      "https://jiji.ng/alimosho/bags/fashion-ladies-bag-63giuN5cX3KfkvWTTo4cEE8t.html?page=1&pos=1&cur_pos=1&ads_per_page=24&ads_count=11751&lid=ght0wAd2KDgidxEv&indexPosition=0"
    );
    console.log(product);
  } catch (error) {
    console.error("Error scraping product page:", error);
  }
};

testjijiScraper();
