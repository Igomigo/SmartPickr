import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Spine } from "./Spine";
import { Stage1 } from "../live/Stage1";
import { ComparisonStage } from "./ComparisonStage";
import { RecommendationStage } from "./RecommendationStage";
import { ProductPopover } from "../../shared/ProductPopover";
import { GlassPanel } from "../../ui/GlassPanel";
import { settleSoft } from "../../design/motion";
import { useIsMobile } from "../../shared/useIsMobile";
import type { Product, IComparison, IRecommendation } from "../../stream/types";

type StageId = "live" | "compare" | "recommend";

interface StageDeckProps {
  statusLog: string[];
  products: Product[];
  comparison: IComparison[] | null;
  recommendation: IRecommendation | null;
}

/**
 * The stage deck. Stages exist as they become available (live → compare →
 * recommend). The newest auto-takes center stage; the rest collapse to spines
 * on the left (desktop) or a row of tabs at the top (mobile). A single product
 * popover is shared across every stage.
 */
export function StageDeck({ statusLog, products, comparison, recommendation }: StageDeckProps) {
  const isMobile = useIsMobile();

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

  const renderStage = () => (
    <>
      {active === "live" && (
        <Stage1 statusLog={statusLog} products={products} onView={setViewing} />
      )}
      {active === "compare" && comparison && (
        <ComparisonStage comparison={comparison} productCount={products.length} onView={view} />
      )}
      {active === "recommend" && recommendation && (
        <RecommendationStage recommendation={recommendation} productCount={products.length} onView={view} />
      )}
    </>
  );

  const popover = (
    <AnimatePresence>
      {viewing && <ProductPopover product={viewing} onClose={() => setViewing(null)} />}
    </AnimatePresence>
  );

  // ---- Mobile: full-screen stage + floating bottom tab bar ---------------
  if (isMobile) {
    return (
      <div className="absolute inset-0 pt-[84px]">
        <div className="relative h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={settleSoft}
              className="absolute inset-0"
            >
              {renderStage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* floating bottom tabs — content scrolls behind it (thumb-friendly) */}
        {stages.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100%-1.5rem)]">
            <GlassPanel radius="pill" className="flex items-center gap-1 p-1.5">
              {stages.map((s) => {
                const on = s.id === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`flex items-center gap-1.5 h-10 px-3.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      on ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <span
                      className={`grid place-items-center w-5 h-5 rounded-full text-[11px] font-semibold shrink-0 ${
                        on ? "bg-white/25 text-white" : "bg-[var(--color-accent)] text-white"
                      }`}
                    >
                      {s.n}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </GlassPanel>
          </div>
        )}

        {popover}
      </div>
    );
  }

  // ---- Desktop: left spines + active layer -------------------------------
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
            {renderStage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {popover}
    </div>
  );
}
