import "dotenv/config";
import { IComparison, IRecommendation, Product } from "../scrapers/types";
import Orchestrator from "../services/scrape.service";
import AIService from "../services/ai.service";

const testjijiScraper = async () => {
  try {
    // Testing the orchestrator
    console.log("Starting to test the orchestrator, hopefully this works 🫣...");
    const searchTerm: string = "iPhone 13";
    const platforms: string[] = ["jiji"];
    const orchestrator = Orchestrator;
    const productDetails: Product[] = await orchestrator.orchestrate(searchTerm, platforms, onStatus, onProduct);
    const comparison: IComparison[] = await AIService.compareProducts(productDetails);
    console.log("🔥".repeat(20));
    console.log(comparison);
    const recommendation: IRecommendation = await AIService.recommend(comparison, productDetails);
    console.log("🚀".repeat(20));
    console.log(recommendation);
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
