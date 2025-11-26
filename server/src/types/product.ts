export interface Review {
  reviewerId: string;
  comment: string;
}
export interface Product {
  productImages: string[];
  productTitle: string;
  productPrice: string;
  productSpecs: Record<string, string>;
  productDescription: string;
  reviews: Review[];
}
