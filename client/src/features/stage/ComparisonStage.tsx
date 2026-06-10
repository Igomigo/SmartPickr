import { motion } from "motion/react";
import { Check, Minus } from "lucide-react";
import { Pill } from "../../ui/Pill";
import { riseIn, press } from "../../design/motion";
import type { IComparison } from "../../stream/types";

interface ComparisonStageProps {
  comparison: IComparison[];
  productCount: number;
  onView: (title: string) => void;
}

/**
 * Stage 2 — the AI comparison. Listings ranked by reliability, each with its
 * score, sentiment, key specs and the strongest pros / cons. Click a card to
 * open the full product details.
 */
export function ComparisonStage({ comparison, productCount, onView }: ComparisonStageProps) {
  const ranked = [...comparison].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

  return (
    <div className="h-full w-full flex flex-col px-8 pb-6">
      <header className="py-5 shrink-0 max-w-[680px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)] mb-1.5">
          AI Comparison
        </div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em]">How the listings stack up</h1>
        <p className="text-[15px] leading-relaxed text-[#54504a] mt-1.5">
          I read through all {productCount} listings and scored each one on what buyers are
          saying, overall condition and price. Here's how they compare — tap any card for the
          full details.
        </p>
      </header>

      <div className="flex-1 overflow-auto pr-1 pt-1">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-2">
          {ranked.map((c, i) => (
            <motion.div key={c.productTitle} {...riseIn} transition={{ ...riseIn.transition, delay: i * 0.04 }}>
              <ComparisonCard c={c} rank={i + 1} onClick={() => onView(c.productTitle)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ c, rank, onClick }: { c: IComparison; rank: number; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={press}
      className="w-full text-left rounded-[20px] bg-white/80 border border-black/[0.05] shadow-[0_10px_30px_-16px_rgba(28,26,24,0.25)] hover:shadow-[0_16px_38px_-18px_rgba(28,26,24,0.32)] transition-shadow p-4 flex gap-4 cursor-pointer"
    >
      <div className="relative shrink-0">
        <img src={c.productImages[0]} alt="" className="w-24 h-24 rounded-[13px] object-cover" />
        <span className="glass absolute -top-2 -left-2 grid place-items-center w-7 h-7 rounded-full text-[12px] font-semibold tabular-nums">
          {rank}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-medium leading-snug text-[var(--color-ink)] line-clamp-2">
            {c.productTitle}
          </h3>
          <ScoreBadge score={c.reliabilityScore} />
        </div>

        <div className="text-[16px] font-semibold mt-1">{c.productPrice}</div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <Pill>{c.reviewSentiment}</Pill>
          <Pill>{c.reviewCount} reviews</Pill>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
          <ul className="space-y-1">
            {c.pros.slice(0, 2).map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-[12.5px] text-[#54504a] leading-snug">
                <Check size={13} className="mt-0.5 shrink-0 text-emerald-600" /> {p}
              </li>
            ))}
          </ul>
          <ul className="space-y-1">
            {c.cons.slice(0, 2).map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-[12.5px] text-[#54504a] leading-snug">
                <Minus size={13} className="mt-0.5 shrink-0 text-rose-400" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 88 ? "text-emerald-600" : score >= 78 ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]";
  return (
    <div className="text-right shrink-0">
      <div className={`text-[22px] font-semibold leading-none tabular-nums ${tone}`}>{score}</div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-faint)] mt-0.5">reliability</div>
    </div>
  );
}
