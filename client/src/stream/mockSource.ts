import type { SearchSource } from "./source";
import { RECORDED_SESSION } from "../mock/recordedSession";

/**
 * Replays the recorded session with its original timing, so the UI behaves
 * exactly as it will against a live stream. Returns a cancel function that
 * stops the replay wherever it is (drives Stop / reset).
 */
export const mockSource: SearchSource = (_params, handlers) => {
  let timer: ReturnType<typeof setTimeout>;
  let cancelled = false;
  let i = 0;

  const next = () => {
    if (cancelled || i >= RECORDED_SESSION.length) return;
    const event = RECORDED_SESSION[i++];

    timer = setTimeout(() => {
      if (cancelled) return;
      switch (event.type) {
        case "status":
          handlers.onStatus(event.message);
          break;
        case "product":
          handlers.onProduct(event.product);
          break;
        case "comparison":
          handlers.onComparison(event.comparison);
          break;
        case "recommendation":
          handlers.onRecommendation(event.recommendation);
          break;
        case "done":
          handlers.onDone();
          return;
      }
      next();
    }, event.delay);
  };

  next();

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
};
