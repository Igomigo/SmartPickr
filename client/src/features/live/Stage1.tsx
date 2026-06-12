import { AnimatePresence, motion } from "motion/react";
import { GlassPanel } from "../../ui/GlassPanel";
import { ActivityLog } from "./ActivityLog";
import { ProductGrid } from "./ProductGrid";
import { settleSoft } from "../../design/motion";
import { useIsMobile } from "../../shared/useIsMobile";
import type { Product } from "../../stream/types";

interface Stage1Props {
  statusLog: string[];
  products: Product[];
  onView: (product: Product) => void;
}

/**
 * The live stage. Two postures:
 *   A — only logs yet: the activity stream is centered and owns the screen.
 *   B — first product lands: logs slide to a left column, the product grid
 *       eases in on the right. The shift starts instantly, settles slowly.
 *
 * On mobile it stacks vertically: a compact activity strip on top, the product
 * grid filling the rest of the screen.
 */
export function Stage1({ statusLog, products, onView }: Stage1Props) {
  const hasProducts = products.length > 0;
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col px-4 pt-2 gap-3">
        {!hasProducts ? (
          <div className="flex-1 flex items-center justify-center">
            <ActivityLog variant="center" lines={statusLog} />
          </div>
        ) : (
          <>
            {/* compact "current activity" strip */}
            <GlassPanel radius="pill" className="flex items-center gap-2.5 px-4 h-11 shrink-0">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span className="text-[14px] font-medium text-[var(--color-ink)] truncate">
                {statusLog[statusLog.length - 1] ?? ""}
              </span>
            </GlassPanel>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={settleSoft}
              className="flex-1 min-h-0 overflow-auto pt-3 px-1 pb-24"
            >
              <ProductGrid products={products} onSelect={(i) => onView(products[i])} />
            </motion.div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full flex gap-6 px-6 pb-6 pt-2">
      {/* activity — animates from centered (full width) to left column */}
      <motion.div
        layout
        transition={settleSoft}
        className={`h-full flex flex-col ${
          hasProducts ? "w-[34%] min-w-[300px] justify-start" : "w-full justify-center"
        }`}
      >
        {hasProducts ? (
          <GlassPanel radius="lg" className="flex-1 min-h-0 p-6 overflow-auto">
            <ActivityLog variant="side" lines={statusLog} />
          </GlassPanel>
        ) : (
          <ActivityLog variant="center" lines={statusLog} />
        )}
      </motion.div>

      {/* products — eases in once the first lands */}
      <AnimatePresence>
        {hasProducts && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: 64 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={settleSoft}
            className="flex-1 min-w-0 overflow-auto pt-3 pl-3 pr-1"
          >
            <ProductGrid products={products} onSelect={(i) => onView(products[i])} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
