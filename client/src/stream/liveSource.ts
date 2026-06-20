import type { SearchSource } from "./source";
import { API_BASE } from "./config";

/**
 * The live source — wraps a browser EventSource against the server's SSE
 * endpoint and adapts it to the SearchSource interface the app is built on.
 *
 * The server is one-shot: it streams status → product* → comparison →
 * recommendation → done, then closes. EventSource would normally auto-reconnect
 * on close (and re-trigger a scrape), so we close it ourselves on `done` and on
 * any terminal error.
 */
export const liveSource: SearchSource = (params, handlers) => {
  const query = new URLSearchParams();
  query.set("searchTerm", params.term);
  params.platforms.forEach((p) => query.append("platforms", p));

  const es = new EventSource(`${API_BASE}/search?${query.toString()}`);
  let finished = false;

  const finish = () => {
    finished = true;
    es.close();
  };

  const on = (event: string, handler: (data: unknown) => void) =>
    es.addEventListener(event, (e) => {
      try {
        handler(JSON.parse((e as MessageEvent).data));
      } catch {
        /* ignore malformed frames (e.g. heartbeats) */
      }
    });

  on("status", (d) => handlers.onStatus((d as { message: string }).message));
  on("product", (d) => handlers.onProduct(d as never));
  on("comparison", (d) => handlers.onComparison(d as never));
  on("recommendation", (d) => handlers.onRecommendation(d as never));

  es.addEventListener("done", () => {
    handlers.onDone();
    finish();
  });

  es.onerror = () => {
    if (finished) return;
    finish();
    handlers.onError("Connection lost. Please try again.");
  };

  return finish;
};
