import { Router } from "express";
import searchController from "../controllers/product.controller";

const router: Router = Router();

router.post("/search", searchController.search);

export default router;
