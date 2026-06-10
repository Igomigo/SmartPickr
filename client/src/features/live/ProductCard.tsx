import { motion } from "motion/react";
import { press } from "../../design/motion";
import { Pill } from "../../ui/Pill";
import type { Product } from "../../stream/types";

interface ProductCardProps {
  product: Product;
  /** 1-based arrival number shown in the badge. */
  index: number;
  onClick: () => void;
}

/** Pull up to two scannable spec pills (condition + storage) for the face. */
function facePills(product: Product): string[] {
  const s = product.productSpecs ?? {};
  return [s["Condition"], s["Internal Storage"]].filter(Boolean) as string[];
}

/**
 * A product card: image on top, title, price (hero), two spec pills. A glassy
 * numbered badge overlaps the top-left corner (arrival order). Soft-solid, not
 * glass — glass stays surgical for chrome. Click opens the full popover.
 */
export function ProductCard({ product, index, onClick }: ProductCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={press}
      className="group relative block w-full text-left cursor-pointer rounded-[20px] bg-white/85 border border-black/[0.05] shadow-[0_10px_30px_-14px_rgba(28,26,24,0.28)] hover:shadow-[0_18px_44px_-16px_rgba(28,26,24,0.34)] transition-shadow p-3"
    >
      {/* number badge — overlaps the corner, glassy, doesn't eat card space */}
      <span className="glass absolute -top-2.5 -left-2.5 z-10 grid place-items-center w-8 h-8 rounded-full text-[13px] font-semibold text-[var(--color-ink)] tabular-nums">
        {index}
      </span>

      <div className="overflow-hidden rounded-[13px] mb-3">
        <img
          src={product.productImages[0]}
          alt=""
          loading="lazy"
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.015]"
        />
      </div>

      <div className="px-1 pb-1">
        <h3 className="text-[14px] font-medium leading-snug text-[var(--color-ink)] line-clamp-2 min-h-[2.6em]">
          {product.productTitle}
        </h3>
        <div className="text-[18px] font-semibold mt-1.5 tracking-[-0.01em]">
          {product.productPrice}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {facePills(product).map((spec) => (
            <Pill key={spec}>{spec}</Pill>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
