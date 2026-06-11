export interface Review {
  reviewerName?: string;
  comment: string;
  rating?: "good" | "bad" | "neutral";
  stars?: number;

}
export interface Product {
  productImages: string[];
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productSpecs?: Record<string, string>;
  productReviews?: Review[];
  productRatingsScore?: string;
  productReviewsTotal?: number;
  productPageUrl?: string;
}

export interface SearchResultLinks {
  link: string;
}

export interface IComparison {
  productImages: string[];
  productTitle: string;
  productPrice: string;
  parsedPrice?: string;
  reviewSentiment: string;
  reviewSummary: string;
  reviewCount: string;
  keySpecs: Record<string, string>;
  pros: string[];
  cons: string[];
  reliabilityScore: number;
  productPageUrl?: string;
}

export interface IRecommendationAlternative {
  productTitle: string;
  productPrice: string;
  productImages: string[];
  productPageUrl: string;
  reason: string;
  whyNotFirst: string;
}

export interface IRecommendation {
  confidentPick: boolean;
  productTitle: string;
  productPrice: string;
  productImages: string[];
  productPageUrl: string;
  headline: string;
  reasons: string[];
  whyOverOthers: string;
  alternative?: IRecommendationAlternative;
  warningNote?: string;
}