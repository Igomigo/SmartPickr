import { AnimatePresence, motion } from "motion/react";
import { GlassPanel } from "../../ui/GlassPanel";
import { ActivityLog } from "./ActivityLog";
import { ProductGrid } from "./ProductGrid";
import { settleSoft } from "../../design/motion";
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
 */
export function Stage1({ statusLog, products, onView }: Stage1Props) {
  const hasProducts = products.length > 0;

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
            initial={{ opacity: 0, x: 28 }}
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
