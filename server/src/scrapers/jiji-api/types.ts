/**
 * Minimal shapes of the parts of Jiji's API responses we actually read.
 * (The real payloads are much larger; we only type what we consume.)
 */

export interface JijiPriceObj {
  value: number;
  view: string; // e.g. "₦ 20,000"
  type: string | null; // e.g. "Negotiable"
}

export interface JijiImage {
  url: string;
}

export interface JijiAttr {
  name?: string;
  value: string;
}

export interface JijiListingAdvert {
  guid: string;
  url: string;
  title: string;
  price_obj?: JijiPriceObj;
}

export interface JijiListingResponse {
  adverts_list?: {
    count?: number;
    adverts?: JijiListingAdvert[];
  };
}

export interface JijiItemResponse {
  advert?: {
    title?: string;
    description?: string;
    price_obj?: JijiPriceObj;
    images?: JijiImage[];
    attrs?: JijiAttr[];
    url?: string;
  };
  seller?: {
    guid?: string;
    feedback_count?: number;
  };
}

/** A reply on a review (can be nested — replies can have replies). */
export interface JijiOpinionReply {
  id: number;
  opinion_id: number;
  user_id: number;
  comment: string;
  date: string; // "16/10/25"
  user_name: string;
  guid: string;
  user_avatar_url: string;
  is_premium: boolean;
  images?: JijiImage[] | null;
  likes_count?: number;
  reply_count?: number;
  replies?: JijiOpinionReply[];
}

/** A single review (opinion) from the seller's feedback. */
export interface JijiOpinion {
  id: number;
  user_id: number;
  guid: string;
  status: string; // "active"
  comment: string;
  advert_id: number | null;
  rating: "good" | "bad" | "neutral";
  stars: number;
  images?: JijiImage[] | null;
  user_name: string;
  user_avatar_url: string;
  date: string; // "07/05/26"
  date_long: number; // unix seconds
  is_premium: boolean;
  likes_count?: number;
  reply_count?: number;
  replies?: JijiOpinionReply[];
}

/** Response from GET /api_web/v1/opinions/{sellerGuid}/{page}.json */
export interface JijiOpinionsResponse {
  status: string; // "ok"
  stats: {
    good: number;
    neutral: number;
    bad: number;
  };
  user_info: {
    user_id: number;
    user_name: string;
    guid: string;
    user_avatar_url: string;
    is_premium: boolean;
    can_leave_opinion: boolean;
  };
  results: JijiOpinion[];
  has_more: boolean;
  count: number; // total reviews, e.g. 55
}

