import { GlassPanel } from "./GlassPanel";

/**
 * The Picky logo: a bold "P" held in a small glass tile, with the "Picky"
 * wordmark plain beside it. The glass wraps only the mark, not the text.
 * Sits top-left of the app shell.
 */
export function Logo() {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <GlassPanel className="grid place-items-center w-9 h-9 rounded-sm">
        <span className="text-[18px] font-bold leading-none tracking-[-0.03em] text-[var(--color-accent)]">
          P
        </span>
      </GlassPanel>
      <span className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
        Picky
      </span>
    </div>
  );
}
