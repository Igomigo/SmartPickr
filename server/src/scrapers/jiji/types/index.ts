export interface Review {
  reviewerName: string;
  comment: string;
  rating: "good" | "bad" | "neutral";
  stars: number;
}
export interface Product {
  productImages: string[];
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productSpecs?: Record<string, string>;
  productReviews?: Review[];
}

// API Response structure from Jiji
export interface JijiReviewsApiResponse {
  status: string;
  stats: {
    bad: number;
    neutral: number;
    good: number;
  };
  user_info: {
    user_id: number;
    user_name: string;
    guid: string;
    user_avatar_url: string;
    can_leave_opinion: boolean;
  };
  results: Array<{
    id: number;
    user_id: number;
    user_name: string;
    comment: string;
    rating: "good" | "bad" | "neutral";
    stars: number;
    date: string;
    status: string;
    likes_count: number;
    replies?: any[];
    reply_count?: number;
    images?: any[];
  }>;
  has_more: boolean;
  count: number;
}
