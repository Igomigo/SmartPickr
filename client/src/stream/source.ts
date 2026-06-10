import type { Product, IComparison, IRecommendation } from "./types";

/**
 * A SearchSource is anything that can run a search and push events back.
 * The mock replays a recorded session; the real one (Phase 6) wraps an
 * EventSource against the server. The app only knows this interface, so
 * swapping mock → live is a one-line change.
 */

export interface SearchParams {
  term: string;
  platforms: string[];
}

export interface SearchHandlers {
  onStatus: (message: string) => void;
  onProduct: (product: Product) => void;
  onComparison: (comparison: IComparison[]) => void;
  onRecommendation: (recommendation: IRecommendation) => void;
  onError: (message: string) => void;
  onDone: () => void;
}

/** Starts a search; returns a cancel function (used by Stop / reset). */
export type SearchSource = (params: SearchParams, handlers: SearchHandlers) => () => void;
