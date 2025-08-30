import { Request, Response } from "express";

class ProductAnalysisController {
  constructor() {}

  public async analyzeProduct(req: Request, res: Response) {
    try {
      const { url }: { url: string } = req.body;
      console.log("Analyzing product...", url);
    } catch (error) {
      console.error("Error analyzing product:", error);
      res.status(500).json({ error: "Failed to analyze product" });
    }
  }
}

export default new ProductAnalysisController();
