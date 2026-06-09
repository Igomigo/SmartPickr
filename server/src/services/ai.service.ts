import { compareUrl, recommendUrl } from "../constants/";
import { IComparison, IRecommendation, Product } from "../scrapers/types";
import { logger } from "../utils/logger";

class AIService {
    private logger;
    private headerToken: string;

    constructor() {
        this.logger = logger;
        this.headerToken = process.env["X-CUSTOM-TOKEN"] ?? "";
    }

    public async compareProducts(details: Product[]) {
        try {
            const response = await fetch(compareUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-custom-token": this.headerToken
                },
                body: JSON.stringify({
                    productDetails: details
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[compare] failed - status: ${response.status}, body: ${errorBody}`);
            }


            const data = (await response.json()) as IComparison[];
            return data;
        } catch (error) {
            logger.error(error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    public async recommend(comparison: IComparison[], productDetails: Product[]) {
        try {
            const response = await fetch(recommendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-custom-token": this.headerToken
                },
                body: JSON.stringify({
                    comparison: comparison,
                    products: productDetails
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[compare] failed - status: ${response.status}, body: ${errorBody}`);
            }


            const data = (await response.json()) as IRecommendation;
            return data;
        } catch (error) {
            logger.error(error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
}

export default new AIService();
