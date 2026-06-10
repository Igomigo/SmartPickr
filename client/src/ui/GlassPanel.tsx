import type { HTMLAttributes } from "react";

type Radius = "md" | "lg" | "xl" | "pill";

const radiusClass: Record<Radius, string> = {
  md: "rounded-[16px]",
  lg: "rounded-[24px]",
  xl: "rounded-[32px]",
  pill: "rounded-full",
};

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner softness. Defaults to lg. */
  radius?: Radius;
  /** Stronger frost for surfaces that sit over busy content. */
  strong?: boolean;
}

/**
 * The one glass surface. Every frosted panel in Picky is this component —
 * top control pill, stage frames, popovers, search bar — varied by props.
 */
export function GlassPanel({
  radius = "lg",
  strong = false,
  className = "",
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={`${strong ? "glass-strong" : "glass"} ${radiusClass[radius]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
