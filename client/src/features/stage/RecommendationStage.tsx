import { motion } from "motion/react";
import { Check, ExternalLink, TriangleAlert, Eye } from "lucide-react";
import { Pill } from "../../ui/Pill";
import { settle, press } from "../../design/motion";
import type { IRecommendation } from "../../stream/types";

interface RecommendationStageProps {
  recommendation: IRecommendation;
  productCount: number;
  onView: (key: { productPageUrl?: string; productTitle: string }) => void;
}

/**
 * Stage 3 — the verdict. The winning listing with the reasons it was chosen,
 * why it beats the others, and a runner-up if there's a close call. The winner
 * and the alternative both open full product details.
 */
export function RecommendationStage({ recommendation: r, productCount, onView }: RecommendationStageProps) {
  return (
    <div className="h-full w-full overflow-auto px-4 lg:px-8 pb-24 lg:pb-10">
      <header className="py-6 max-w-[780px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)] mb-2.5">
          AI Recommendation
        </div>
        <h1 className="text-[26px] lg:text-[32px] font-semibold leading-[1.12] tracking-[-0.02em]">
          {r.headline}
        </h1>
        <p className="text-[16px] leading-relaxed text-[#54504a] mt-3">
          I compared all {productCount} listings on what buyers are saying, overall condition and
          price. This is the one I'd actually buy.
        </p>
      </header>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6 lg:gap-10 items-start">
        {/* winner */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={settle}>
          <div className="rounded-[24px] overflow-hidden bg-white/80 border border-black/[0.05] shadow-[0_22px_50px_-20px_rgba(28,26,24,0.32)]">
            <button
              type="button"
              onClick={() => onView({ productPageUrl: r.productPageUrl, productTitle: r.productTitle })}
              className="group block w-full overflow-hidden cursor-pointer"
            >
              <img
                src={r.productImages[0]}
                alt=""
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.015]"
              />
            </button>
            <div className="p-6">
              {r.confidentPick && (
                <Pill tone="glass" className="mb-3">
                  <Check size={13} className="text-emerald-600" /> Confident pick
                </Pill>
              )}
              <h2 className="text-[17px] font-medium leading-snug">{r.productTitle}</h2>
              <div className="text-[24px] font-semibold mt-1.5">{r.productPrice}</div>

              <div className="flex flex-col gap-2.5 mt-5">
                <a
                  href={r.productPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-[var(--color-accent)] text-white text-[14px] font-medium hover:bg-[var(--color-accent-soft)] transition-colors"
                >
                  View deal on Jiji <ExternalLink size={15} />
                </a>
                <button
                  type="button"
                  onClick={() => onView({ productPageUrl: r.productPageUrl, productTitle: r.productTitle })}
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full border border-black/10 text-[14px] font-medium text-[var(--color-ink)] hover:bg-black/[0.03] transition-colors cursor-pointer"
                >
                  <Eye size={15} /> View details
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* reasoning */}
        <div className="max-w-[640px]">
          <Section title="Why this one">
            <ul className="space-y-2.5">
              {r.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#3d3a34]">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check size={13} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Why over the others">
            <p className="text-[15px] leading-relaxed text-[#3d3a34]">{r.whyOverOthers}</p>
          </Section>

          {r.alternative && (
            <Section title="My alternative">
              <motion.button
                type="button"
                onClick={() =>
                  onView({
                    productPageUrl: r.alternative!.productPageUrl,
                    productTitle: r.alternative!.productTitle,
                  })
                }
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.995 }}
                transition={press}
                className="w-full text-left rounded-[18px] bg-white/70 border border-black/[0.05] hover:shadow-[0_14px_34px_-18px_rgba(28,26,24,0.3)] transition-shadow p-4 flex gap-4 cursor-pointer"
              >
                <img src={r.alternative.productImages[0]} alt="" className="w-20 h-20 rounded-[12px] object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Pill>Alternative</Pill>
                    <span className="text-[15px] font-semibold">{r.alternative.productPrice}</span>
                  </div>
                  <h3 className="text-[14px] font-medium leading-snug mt-1.5">{r.alternative.productTitle}</h3>
                  <p className="text-[13px] text-[#54504a] mt-1 leading-relaxed">{r.alternative.reason}</p>
                </div>
              </motion.button>
            </Section>
          )}

          {r.warningNote && (
            <div className="flex items-start gap-2.5 mt-6 rounded-[16px] bg-amber-50/70 border border-amber-200/60 p-4 text-[14px] leading-relaxed text-amber-900">
              <TriangleAlert size={17} className="shrink-0 mt-0.5" /> {r.warningNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)] mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
