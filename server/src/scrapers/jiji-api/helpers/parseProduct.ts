import { Product } from "../../types";
import { JijiItemResponse } from "../types";

/**
 * Map Jiji's item API response into our internal Product shape.
 *
 * Reviews: the API gives us the seller's `feedback_count` but NOT the review
 * text (that loads from a separate, not-yet-identified endpoint). Reviews are
 * seller-level + popover-only/secondary in our design, so we surface the count
 * via `productReviewsTotal` and leave `productReviews` empty for now.
 */
export function parseProduct(
  data: JijiItemResponse,
  productPageUrl: string,
): Product {
  const advert = data.advert ?? {};

  // Specs: API returns a flat attrs array of { name, value }. Some entries have
  // no name (e.g. "Bulk prices") — skip those so the spec map stays clean.
  const productSpecs: Record<string, string> = {};
  for (const attr of advert.attrs ?? []) {
    if (attr.name) productSpecs[attr.name] = attr.value;
  }

  return {
    productTitle: advert.title ?? "",
    productPrice: advert.price_obj?.view ?? "",
    productDescription: advert.description ?? "",
    productImages: (advert.images ?? []).map((img) => img.url).filter(Boolean),
    productSpecs,
    productReviews: [],
    productReviewsTotal: data.seller?.feedback_count ?? 0,
    productPageUrl,
  };
}
