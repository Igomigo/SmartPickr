import { TopControl } from "./TopControl";
import { StageDeck } from "../stage/StageDeck";
import type { useSearchMachine } from "../../stream/useSearchMachine";

type Machine = ReturnType<typeof useSearchMachine>;

/**
 * The live experience shell: the persistent top control + the stage deck
 * (Live → Comparison → Recommendation as collapsing layers).
 */
export function LiveView({ machine }: { machine: Machine }) {
  const { state, stop, reset } = machine;

  return (
    <div className="absolute inset-0">
      <TopControl
        phase={state.phase}
        count={state.products.length}
        onStop={stop}
        onReset={reset}
      />
      <StageDeck
        statusLog={state.statusLog}
        products={state.products}
        comparison={state.comparison}
        recommendation={state.recommendation}
      />
    </div>
  );
}
