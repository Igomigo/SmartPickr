import type { HTMLAttributes } from "react";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  /** Frosted glass pill (default) vs a quiet solid tint. */
  tone?: "glass" | "soft";
}

/**
 * A small rounded label/chip — used for spec pills on cards, status bits,
 * and inline tags. Stays calm and minimal.
 */
export function Pill({ tone = "soft", className = "", children, ...rest }: PillProps) {
  const toneClass =
    tone === "glass"
      ? "glass"
      : "bg-white/55 border border-white/70";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[13px] font-medium text-[var(--color-muted)] ${toneClass} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
