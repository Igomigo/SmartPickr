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
  ProductRatingsScore?: string;
  ProductReviewsTotal?: number;
}

export interface SearchResultLinks {
  link: string;
}
