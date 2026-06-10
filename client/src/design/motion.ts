/**
 * Motion tokens — the single source of truth for how Picky moves.
 *
 * The law: react instantly, settle softly. Springs, not linear easings.
 * "Alive" is the soft settle; it is never genuinely slow to respond.
 */
import type { Transition } from "motion/react";

/** Default soft settle — most UI transitions use this. */
export const settle: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 30,
  mass: 1,
};

/** A gentler, slower settle — for larger surfaces (stages, panels). */
export const settleSoft: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 28,
  mass: 1.1,
};

/** Snappy press/hover feedback — quick, with a touch of spring. */
export const press: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 32,
};

/** The signature "rise + fade in" used by cards and arriving content. */
export const riseIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: settle,
};
