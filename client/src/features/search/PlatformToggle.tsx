import { motion } from "motion/react";
import { press } from "../../design/motion";

export interface Platform {
  id: string;
  label: string;
  available: boolean;
}

export const PLATFORMS: Platform[] = [
  { id: "jiji", label: "Jiji", available: true },
  { id: "jumia", label: "Jumia", available: false },
  { id: "konga", label: "Konga", available: false },
  { id: "amazon", label: "Amazon", available: false },
];

interface PlatformToggleProps {
  selected: string[];
  onChange: (next: string[]) => void;
}

/**
 * Lets the user choose which platforms to scrape. Only Jiji is live today;
 * the rest show as "soon" to signal where Picky is heading.
 */
export function PlatformToggle({ selected, onChange }: PlatformToggleProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]
    );
  };

  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="text-[14px] text-[var(--color-muted)] mr-1">Search on</span>
      {PLATFORMS.map((p) => {
        const isOn = selected.includes(p.id);
        return (
          <motion.button
            key={p.id}
            type="button"
            disabled={!p.available}
            onClick={() => p.available && toggle(p.id)}
            whileHover={p.available ? { scale: 1.04 } : undefined}
            whileTap={p.available ? { scale: 0.96 } : undefined}
            transition={press}
            className={[
              "h-8 px-3.5 rounded-full text-[13px] font-medium transition-colors",
              p.available ? "cursor-pointer" : "cursor-default opacity-45",
              isOn
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white/55 border border-white/70 text-[var(--color-muted)]",
            ].join(" ")}
          >
            {p.label}
            {!p.available && (
              <span className="ml-1.5 text-[11px] opacity-70">soon</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
