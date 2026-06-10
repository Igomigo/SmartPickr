import { motion } from "motion/react";
import { settleSoft } from "../../design/motion";

interface SpineProps {
  number: number;
  label: string;
  onClick: () => void;
}

/**
 * A collapsed stage — a slim vertical tab on the left edge. Click to bring its
 * layer back to center. This is what a completed stage folds into.
 */
export function Spine({ number, label, onClick }: SpineProps) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      transition={settleSoft}
      whileHover={{ x: 2 }}
      className="glass group h-full w-14 shrink-0 flex flex-col items-center justify-center gap-4 cursor-pointer"
    >
      <span className="grid place-items-center w-7 h-7 rounded-full bg-[var(--color-accent)] text-white text-[13px] font-semibold tabular-nums">
        {number}
      </span>
      <span className="text-[13px] font-medium tracking-wide text-[var(--color-muted)] group-hover:text-[var(--color-ink)] [writing-mode:vertical-rl] rotate-180 transition-colors">
        {label}
      </span>
    </motion.button>
  );
}
