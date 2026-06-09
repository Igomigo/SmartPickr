import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { SSEConnection } from "../services/sse.service";
import Orchestrator from "../services/scrape.service";
import AIService from "../services/ai.service";
import { Product } from "../scrapers/types";

class SearchController {
  private logger;
  private sse;

  constructor() {
    this.logger = logger;
    this.sse = SSEConnection;
  }

  public async search(req: Request, res: Response) {
    const { searchTerm, platforms }: { searchTerm: string, platforms: string[] } = req.body;
    const sseService = new this.sse(res);

    try {
      const onStatus = (message: string) => {
        sseService.send("status", { message });
      };

      const onProduct = (product: Product) => {
        sseService.send("product", product);
      }

      const products: Product[] = await Orchestrator.orchestrate(searchTerm, platforms, onStatus, onProduct);

      const comparison = await AIService.compareProducts(products);
      sseService.send("comparison", comparison);

      const recommendation = await AIService.recommend(comparison, products);
      sseService.send("recommendation", recommendation);

      sseService.end();

      logger.log("Analyzing product...");
    } catch (error: any) {
      sseService.send("status", { message: "Something went wrong. Please try again." });
      sseService.end();

      logger.error(`Error analyzing product: ${error}`);
    }
  }
}

export default new SearchController();
