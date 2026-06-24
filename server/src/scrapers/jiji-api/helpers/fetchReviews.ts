import { JIJI_OPINIONS_ENDPOINT } from "../constants";
import { JijiOpinionsResponse } from "../types";
import { fetchJson } from "./fetchJson";

/**
 * Fetches the reviews for a particular product
 * @param sellerGuid
 * @returns
 */
export async function fetchReviews(
  sellerGuid: string,
): Promise<JijiOpinionsResponse> {
  const res = await fetchJson<JijiOpinionsResponse>(
    `${JIJI_OPINIONS_ENDPOINT}/${sellerGuid}/1.json?reply_limit=2`,
  );

  return res;
}
