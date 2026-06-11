import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Spine } from "./Spine";
import { Stage1 } from "../live/Stage1";
import { ComparisonStage } from "./ComparisonStage";
import { RecommendationStage } from "./RecommendationStage";
import { ProductPopover } from "../live/ProductPopover";
import { settleSoft } from "../../design/motion";
import type { Product, IComparison, IRecommendation } from "../../stream/types";

type StageId = "live" | "compare" | "recommend";

interface StageDeckProps {
  statusLog: string[];
  products: Product[];
  comparison: IComparison[] | null;
  recommendation: IRecommendation | null;
}

/**
 * The spine deck. Stages exist as they become available (live → compare →
 * recommend). The newest auto-takes center stage; the rest collapse to spines
 * on the left. Click a spine to bring that layer back. New layers slide in from
 * the right and settle softly. A single product popover is shared across every
 * stage — any product, comparison row or recommendation can open its details.
 */
export function StageDeck({ statusLog, products, comparison, recommendation }: StageDeckProps) {
  const stages = useMemo(() => {
    const list: { id: StageId; n: number; label: string }[] = [{ id: "live", n: 1, label: "Live" }];
    if (comparison) list.push({ id: "compare", n: 2, label: "Comparison" });
    if (recommendation) list.push({ id: "recommend", n: 3, label: "Recommendation" });
    return list;
  }, [comparison, recommendation]);

  const [active, setActive] = useState<StageId>("live");
  const [viewing, setViewing] = useState<Product | null>(null);

  // Auto-advance to the newest layer as it arrives.
  useEffect(() => {
    if (recommendation) setActive("recommend");
    else if (comparison) setActive("compare");
  }, [comparison, recommendation]);

  // Resolve a comparison/recommendation item back to its full product so the
  // same rich popover can open from anywhere. Prefer the stable page URL, fall
  // back to the title.
  const byUrl = useMemo(
    () => new Map(products.filter((p) => p.productPageUrl).map((p) => [p.productPageUrl, p])),
    [products]
  );
  const byTitle = useMemo(() => new Map(products.map((p) => [p.productTitle, p])), [products]);

  const view = (key: { productPageUrl?: string; productTitle: string }) => {
    const p = (key.productPageUrl && byUrl.get(key.productPageUrl)) || byTitle.get(key.productTitle);
    if (p) setViewing(p);
  };

  const spines = stages.filter((s) => s.id !== active);

  return (
    <div className="absolute inset-0 pt-20 flex">
      {/* collapsed stages */}
      <div className="flex h-full gap-[3px]">
        <AnimatePresence initial={false}>
          {spines.map((s) => (
            <motion.div
              key={s.id}
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 56, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={settleSoft}
              className="h-full overflow-hidden"
            >
              <Spine number={s.n} label={s.label} onClick={() => setActive(s.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* active layer */}
      <div className="relative flex-1 min-w-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={settleSoft}
            className="absolute inset-0"
          >
            {active === "live" && (
              <Stage1 statusLog={statusLog} products={products} onView={setViewing} />
            )}
            {active === "compare" && comparison && (
              <ComparisonStage
                comparison={comparison}
                productCount={products.length}
                onView={view}
              />
            )}
            {active === "recommend" && recommendation && (
              <RecommendationStage
                recommendation={recommendation}
                productCount={products.length}
                onView={view}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* shared product detail popover */}
      <AnimatePresence>
        {viewing && <ProductPopover product={viewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </div>
  );
}
