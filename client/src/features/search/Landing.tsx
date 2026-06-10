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
        className="flex flex-col items-center gap-8 w-full"
      >
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <h1 className="text-[64px] leading-none font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
            Picky
          </h1>
          <p className="text-[17px] text-[var(--color-muted)] tracking-[-0.01em]">
            Tell me what you want. I&rsquo;ll find the one worth buying.
          </p>
        </div>

        <SearchBar onSubmit={(term) => onSearch(term, platforms)} />

        <PlatformToggle selected={platforms} onChange={setPlatforms} />
      </motion.div>
    </div>
  );
}
