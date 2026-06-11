import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { SSEConnection } from "../services/sse.service";
import Orchestrator from "../services/scrape.service";
import AIService from "../services/ai.service";
import { Product } from "../scrapers/types";

class SearchController {

  public async search(req: Request, res: Response) {
    const searchTerm = req.query.searchTerm as string;
    const platforms = [req.query.platforms].flat() as string[];
    const sseService = new SSEConnection(res);

    try {
      const onStatus = (message: string) => {
        sseService.send("status", { message });
      };

      const onProduct = (product: Product) => {
        sseService.send("product", product);
      }

      const products: Product[] = await Orchestrator.orchestrate(searchTerm, platforms, onStatus, onProduct);

      onStatus("Analyzing the listings...");

      const comparison = await AIService.compareProducts(products);
      // Attach each listing's page URL (the "deal") so the UI can open full
      // product details and link out from the comparison view.
      const byTitle = new Map(products.map((p) => [p.productTitle, p]));
      const enrichedComparison = comparison.map((c) => ({
        ...c,
        productPageUrl: byTitle.get(c.productTitle)?.productPageUrl,
      }));
      sseService.send("comparison", enrichedComparison);

      const recommendation = await AIService.recommend(comparison, products);
      sseService.send("recommendation", recommendation);

      // Final signal so the browser EventSource closes cleanly (no reconnect).
      sseService.send("done", {});
      sseService.end();
    } catch (error: any) {
      sseService.send("status", { message: `Something went wrong. Please try again.` });
      sseService.end();

      logger.error(`Error analyzing product: ${error}`);
    }
  }
}

export default new SearchController();
