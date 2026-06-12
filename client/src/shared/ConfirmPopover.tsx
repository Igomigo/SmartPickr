import { AnimatePresence, motion } from "motion/react";
import { GlassPanel } from "../ui/GlassPanel";
import { settle } from "../design/motion";

interface ConfirmPopoverProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
  /** Positioning classes relative to the trigger's wrapper (which must be `relative`). */
  className?: string;
}

/**
 * A small, reusable confirmation popover that anchors beneath its trigger —
 * no full-screen dim, so it never interrupts what's happening on the page. A
 * transparent click-away layer dismisses it. Place inside a `relative` wrapper.
 */
export function ConfirmPopover({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
  className = "top-full mt-2 left-1/2 -translate-x-1/2",
}: ConfirmPopoverProps) {
  const confirmClass =
    tone === "danger"
      ? "bg-rose-500 hover:bg-rose-600 text-white"
      : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* transparent click-away — dismiss without dimming the page */}
          <div className="fixed inset-0 z-40" onClick={onCancel} />

          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={settle}
            className={`absolute z-50 ${className}`}
          >
            <GlassPanel strong radius="lg" className="w-[280px] p-4">
              <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">{title}</h4>
              {description && (
                <p className="text-[13px] leading-relaxed text-[#54504a] mt-1.5">{description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={onCancel}
                  className="flex-1 h-9 rounded-full text-[14px] font-medium text-[var(--color-ink)] border border-black/10 hover:bg-black/[0.04] transition-colors cursor-pointer"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 h-9 rounded-full text-[14px] font-medium transition-colors cursor-pointer ${confirmClass}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
