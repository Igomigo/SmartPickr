import { useState } from "react";
import { motion } from "motion/react";
import { SearchBar } from "./SearchBar";
import { PlatformToggle } from "./PlatformToggle";
import { settle } from "../../design/motion";

interface LandingProps {
  onSearch: (term: string, platforms: string[]) => void;
}

/**
 * The opening screen: wordmark, one line of intent, the search bar, and the
 * platform toggle. Calm, centered, lots of air.
 */
export function Landing({ onSearch }: LandingProps) {
  const [platforms, setPlatforms] = useState<string[]>(["jiji"]);

  return (
    <div className="h-full w-full grid place-items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={settle}
        className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-[680px] mx-auto"
      >
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-2.5 md:gap-3 mb-1 md:mb-2">
          <h1 className="text-[clamp(2.75rem,12vw,4rem)] leading-none font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
            Picky
          </h1>
          <p className="text-[15px] md:text-[17px] text-[var(--color-muted)] tracking-[-0.01em] text-center text-balance px-4">
            Tell me what you want. I&rsquo;ll find the one worth buying.
          </p>
        </div>

        <SearchBar onSubmit={(term) => onSearch(term, platforms)} />

        <PlatformToggle selected={platforms} onChange={setPlatforms} />
      </motion.div>
    </div>
  );
}
