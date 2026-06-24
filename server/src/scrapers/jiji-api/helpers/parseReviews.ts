import { Review } from "../../types";
import { JijiOpinionsResponse } from "../types";

/**
 * Returns the actual review comments
 * @param result
 * @returns
 */
export function parseReviews(result: JijiOpinionsResponse) {
  const results = result.results;
  let comments: Review[] = results.map((r) => {
    return { comment: r.comment };
  });

  return comments;
}
