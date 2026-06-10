import { useCallback, useRef, useState } from "react";
import type { Product, IComparison, IRecommendation } from "./types";
import type { SearchSource } from "./source";
import { mockSource } from "./mockSource";

/**
 * Lifecycle of a search:
 *   idle → connecting → live → comparing → recommending → done
 * plus terminal "stopped" (user halted) and "error".
 */
export type Phase =
  | "idle"
  | "connecting"
  | "live"
  | "comparing"
  | "recommending"
  | "done"
  | "stopped"
  | "error";

export interface SearchState {
  phase: Phase;
  term: string;
  platforms: string[];
  statusLog: string[];
  products: Product[];
  comparison: IComparison[] | null;
  recommendation: IRecommendation | null;
  error: string | null;
}

const initialState: SearchState = {
  phase: "idle",
  term: "",
  platforms: [],
  statusLog: [],
  products: [],
  comparison: null,
  recommendation: null,
  error: null,
};

/**
 * Owns the SSE connection and all derived state. The UI is a pure function of
 * what this returns. Source is injectable — defaults to the mock replay; pass
 * the live EventSource source in Phase 6 without touching this hook.
 */
export function useSearchMachine(source: SearchSource = mockSource) {
  const [state, setState] = useState<SearchState>(initialState);
  const cancelRef = useRef<(() => void) | null>(null);

  const start = useCallback(
    (term: string, platforms: string[]) => {
      cancelRef.current?.();
      setState({ ...initialState, phase: "connecting", term, platforms });

      cancelRef.current = source(
        { term, platforms },
        {
          onStatus: (message) =>
            setState((s) => ({
              ...s,
              // first status flips connecting → live
              phase: s.phase === "connecting" ? "live" : s.phase,
              statusLog: [...s.statusLog, message],
            })),
          onProduct: (product) =>
            setState((s) => ({ ...s, products: [...s.products, product] })),
          onComparison: (comparison) =>
            setState((s) => ({ ...s, phase: "comparing", comparison })),
          onRecommendation: (recommendation) =>
            setState((s) => ({ ...s, phase: "recommending", recommendation })),
          onError: (message) =>
            setState((s) => ({ ...s, phase: "error", error: message })),
          onDone: () =>
            setState((s) => (s.phase === "error" ? s : { ...s, phase: "done" })),
        }
      );
    },
    [source]
  );

  /** Halt the stream but keep whatever we've gathered so far. */
  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setState((s) => ({ ...s, phase: "stopped" }));
  }, []);

  /** Clear everything back to the landing. */
  const reset = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setState(initialState);
  }, []);

  return { state, start, stop, reset };
}
