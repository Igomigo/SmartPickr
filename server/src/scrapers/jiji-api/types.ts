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
    feedback_count?: number;
  };
}
