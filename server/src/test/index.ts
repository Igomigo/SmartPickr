import { Product } from "../scrapers/types";
import Orchestrator from "../services/scrape.service";

const testjijiScraper = async () => {
  try {
    // Testing the orchestrator
    console.log("Starting to test the orchestrator, hopefully this works 🫣...");
    const searchTerm: string = "iphone 16 pro max";
    const platforms: string[] = ["jiji"];
    const orchestrator = Orchestrator;
    await orchestrator.orchestrate(searchTerm, platforms, onStatus, onProduct);
    console.log("");
  } catch (error) {
    console.error("Error scraping product page:", error);
  }
};

const onStatus = (s: string) => {
  console.log(s);
};

const onProduct = (obj: Product) => {
  console.log(obj);
};

testjijiScraper();
