import { AnimatePresence, motion } from "motion/react";
import { ProductCard } from "./ProductCard";
import { settle } from "../../design/motion";
import type { Product } from "../../stream/types";

interface ProductGridProps {
  products: Product[];
  onSelect: (index: number) => void;
}

/**
 * The river of products. A responsive grid that fills top-to-bottom; each new
 * card rises and fades in (never jumps). Newest lands at the front of the flow.
 */
export function ProductGrid({ products, onSelect }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 content-start">
      <AnimatePresence initial={false}>
        {products.map((product, i) => (
          <motion.div
            key={product.productPageUrl ?? i}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={settle}
          >
            <ProductCard product={product} index={i + 1} onClick={() => onSelect(i)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
