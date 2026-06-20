import { useState } from "react";
import { motion } from "motion/react";
import { Square, RotateCcw } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";
import { ConfirmPopover } from "../../shared/ConfirmPopover";
import { settle } from "../../design/motion";
import type { Phase } from "../../stream/useSearchMachine";

interface TopControlProps {
  phase: Phase;
  count: number;
  onStop: () => void;
  onReset: () => void;
}

const LIVE: Phase[] = ["connecting", "live", "comparing", "recommending"];

/**
 * The persistent floating control — one element, several jobs: a live pulse,
 * the current phase, the product count, and Stop / New search. (Later this is
 * also where the search bar morphs into.)
 */
export function TopControl({ phase, count, onStop, onReset }: TopControlProps) {
  const isLive = LIVE.includes(phase);
  const [confirmStop, setConfirmStop] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={settle}
      className="absolute top-6 z-30 left-1/2 -translate-x-1/2 max-lg:left-auto max-lg:right-3 max-lg:translate-x-0"
    >
      <GlassPanel radius="pill" className="flex items-center gap-3 h-12 pl-4 pr-1.5">
        <span className="flex items-center gap-2 text-[14px] font-medium">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
          )}
          <span className="text-[var(--color-muted)]">{label(phase)}</span>
          <span className="text-[var(--color-faint)]">·</span>
          <span className="tabular-nums">{count} found</span>
        </span>

        {isLive ? (
          <button
            onClick={() => setConfirmStop(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[14px] font-medium text-[var(--color-ink)] hover:bg-white/60 transition-colors cursor-pointer"
          >
            <Square size={14} /> <span className="hidden md:inline">Stop</span>
          </button>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[14px] font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> <span className="hidden md:inline">New search</span>
          </button>
        )}
      </GlassPanel>

      <ConfirmPopover
        open={confirmStop}
        tone="danger"
        title="Stop the search?"
        description="This ends the search right now and keeps only what's been gathered so far. It can't be resumed."
        confirmLabel="Stop"
        cancelLabel="Keep going"
        className="top-full mt-2 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto"
        onConfirm={() => {
          setConfirmStop(false);
          onStop();
        }}
        onCancel={() => setConfirmStop(false)}
      />

      <ConfirmPopover
        open={confirmReset}
        title="Start a new search?"
        description="This clears the current results and takes you back to the start. You can't undo it."
        confirmLabel="New search"
        cancelLabel="Stay here"
        className="top-full mt-2 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto"
        onConfirm={() => {
          setConfirmReset(false);
          onReset();
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </motion.div>
  );
}

function label(phase: Phase): string {
  switch (phase) {
    case "connecting": return "Connecting";
    case "live": return "Scanning";
    case "comparing": return "Comparing";
    case "recommending": return "Recommending";
    case "done": return "Done";
    case "stopped": return "Stopped";
    case "error": return "Something went wrong";
    default: return "";
  }
}
