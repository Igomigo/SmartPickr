import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { settle } from "../../design/motion";

interface ActivityLogProps {
  lines: string[];
  /** "center" = posture A (owns the screen). "side" = posture B (left column). */
  variant: "center" | "side";
}

/**
 * The breathing activity stream. The newest line is bright; older lines fade
 * back so it reads as the system "thinking out loud." Auto-scrolls to newest.
 */
export function ActivityLog({ lines, variant }: ActivityLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines.length]);

  const isCenter = variant === "center";

  return (
    <div className={isCenter ? "w-full max-w-[560px] mx-auto text-center" : "h-full"}>
      {!isCenter && (
        <h2 className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-faint)] mb-4">
          Activity
        </h2>
      )}

      <ul className={`flex flex-col gap-2.5 ${isCenter ? "items-center" : ""}`}>
        <AnimatePresence initial={false}>
          {lines.map((line, i) => {
            const isLatest = i === lines.length - 1;
            // older lines fade with distance from the newest
            const dist = lines.length - 1 - i;
            const opacity = isLatest ? 1 : Math.max(0.28, 1 - dist * 0.18);
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity, y: 0 }}
                exit={{ opacity: 0 }}
                transition={settle}
                className={`flex items-center gap-2.5 ${
                  isCenter ? "text-[19px] justify-center" : "text-[15px]"
                } ${isLatest ? "text-[var(--color-ink)] font-medium" : "text-[var(--color-muted)]"}`}
              >
                {isLatest && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  </span>
                )}
                <span>{line}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <div ref={endRef} />
    </div>
  );
}
