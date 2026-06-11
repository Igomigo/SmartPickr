/**
 * Shared stream types — mirror the server's domain + SSE event shapes.
 * (Kept in sync with server/src/scrapers/types.ts.)
 */

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
  productPageUrl?: string; // the listing's "deal" link, attached server-side
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

/* ------------------------------------------------------------------
   SSE events — the four event types the server streams, plus a local
   "done" sentinel for when the stream closes.
   ------------------------------------------------------------------ */
export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "product"; product: Product }
  | { type: "comparison"; comparison: IComparison[] }
  | { type: "recommendation"; recommendation: IRecommendation }
  | { type: "done" };

/** A recorded event carries the delay (ms) to wait before emitting it. */
export type RecordedEvent = StreamEvent & { delay: number };
