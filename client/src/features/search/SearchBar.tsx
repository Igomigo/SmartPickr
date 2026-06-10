import { useState } from "react";
import { motion } from "motion/react";
import { Search, ArrowRight } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";
import { press } from "../../design/motion";

interface SearchBarProps {
  onSubmit: (term: string) => void;
}

/**
 * The hero search field. A frosted glass pill: search icon, the input,
 * and a round "go" button. (In a later phase this whole bar morphs up into
 * the top control pill via a shared layoutId.)
 */
export function SearchBar({ onSubmit }: SearchBarProps) {
  const [term, setTerm] = useState("");
  const canGo = term.trim().length > 0;

  const submit = () => {
    if (canGo) onSubmit(term.trim());
  };

  return (
    <GlassPanel
      radius="pill"
      className="flex items-center gap-3 w-full max-w-[640px] h-[68px] pl-6 pr-2.5"
    >
      <Search size={20} className="text-[var(--color-faint)] shrink-0" />
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Iphone 16 pro max…"
        autoFocus
        className="flex-1 bg-transparent outline-none text-[18px] text-[var(--color-ink)] placeholder:text-[var(--color-faint)]"
      />
      <motion.button
        type="button"
        onClick={submit}
        disabled={!canGo}
        whileHover={canGo ? { scale: 1.05 } : undefined}
        whileTap={canGo ? { scale: 0.95 } : undefined}
        transition={press}
        aria-label="Search"
        className={[
          "grid place-items-center w-12 h-12 rounded-full shrink-0 transition-colors",
          canGo
            ? "bg-[var(--color-accent)] text-white cursor-pointer"
            : "bg-black/5 text-[var(--color-faint)] cursor-default",
        ].join(" ")}
      >
        <ArrowRight size={20} />
      </motion.button>
    </GlassPanel>
  );
}
