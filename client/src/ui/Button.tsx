import type { ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";
import { press } from "../design/motion";

type Variant = "primary" | "glass" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium select-none " +
  "cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-default";

const variants: Record<Variant, string> = {
  // Solid accent — the main call to action.
  primary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-soft)]",
  // Frosted — for chrome controls that sit over content.
  glass: "glass text-[var(--color-ink)] hover:bg-white/70",
  // Quiet — text-only, low emphasis.
  ghost: "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px] rounded-full",
  lg: "h-14 px-7 text-[17px] rounded-full",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={press}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
