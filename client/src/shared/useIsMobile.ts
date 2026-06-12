import { useEffect, useState } from "react";

/**
 * True when the viewport is below the given breakpoint (default 1024px = Tailwind
 * `lg`). At this cutoff phones AND iPad-portrait get the purpose-built mobile
 * layout, while iPad-landscape / laptops / desktop keep the desktop layout.
 * Pair CSS overrides with `max-lg:` / `lg:` to stay in sync with this value.
 */
export function useIsMobile(breakpoint = 1024): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}
