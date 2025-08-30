import { Router } from "express";
import ProductAnalysisController from "../controllers/product.controller";

const router: Router = Router();

router.post("/analyze", ProductAnalysisController.analyzeProduct);

export default router;
