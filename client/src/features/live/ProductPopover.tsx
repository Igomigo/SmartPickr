import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";
import { Pill } from "../../ui/Pill";
import { settleSoft } from "../../design/motion";
import type { Product } from "../../stream/types";

interface ProductPopoverProps {
  product: Product;
  onClose: () => void;
}

/**
 * Click-to-open detail view: image carousel + full specs, description and
 * reviews. A dim, blurred scrim sits behind it; everything else keeps running.
 */
export function ProductPopover({ product, onClose }: ProductPopoverProps) {
  const [img, setImg] = useState(0);
  const images = product.productImages;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImg((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setImg((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  const specs = Object.entries(product.productSpecs ?? {});
  const reviews = product.productReviews ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-40 grid place-items-center p-6 bg-[rgba(28,26,24,0.28)] backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={settleSoft}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[920px] max-h-[86vh]"
      >
        <GlassPanel strong radius="xl" className="grid grid-cols-1 md:grid-cols-[1fr_1fr] overflow-hidden max-h-[86vh]">
          {/* carousel */}
          <div className="relative bg-black/5 aspect-square md:aspect-auto md:h-full min-h-[320px]">
            <img src={images[img]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <CarouselBtn side="left" onClick={() => setImg((i) => (i - 1 + images.length) % images.length)} />
                <CarouselBtn side="right" onClick={() => setImg((i) => (i + 1) % images.length)} />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImg(i)}
                      className={`h-1.5 rounded-full transition-all ${i === img ? "w-5 bg-white" : "w-1.5 bg-white/55"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* details — translucent but readable: glassy feel, dark text on a
              light frosted wash (sits over the panel's backdrop blur) */}
          <div className="relative p-6 md:p-7 overflow-auto max-h-[86vh] bg-white/70">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-[20px] font-semibold leading-tight pr-10">{product.productTitle}</h2>
            <div className="text-[24px] font-semibold mt-2 tracking-[-0.01em]">{product.productPrice}</div>

            {specs.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {specs.map(([k, v]) => (
                  <div key={k} className="text-[13px]">
                    <div className="text-[#54504a]">{k}</div>
                    <div className="text-[var(--color-ink)] font-medium">{v}</div>
                  </div>
                ))}
              </div>
            )}

            {product.productDescription && (
              <p className="mt-5 text-[14px] leading-relaxed text-[#54504a]">
                {product.productDescription}
              </p>
            )}

            {reviews.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#33302b]">
                    Seller reviews
                  </h3>
                  {product.productRatingsScore && (
                    <Pill>★ {product.productRatingsScore}</Pill>
                  )}
                </div>
                <div className="space-y-2.5">
                  {reviews.slice(0, 6).map((r, i) => (
                    <p key={i} className="text-[13px] leading-relaxed text-[#54504a] border-l-2 border-black/[0.08] pl-3">
                      {r.comment}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {product.productPageUrl && (
              <a
                href={product.productPageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-6 text-[14px] font-medium text-[var(--color-accent)] hover:underline"
              >
                View on Jiji <ExternalLink size={15} />
              </a>
            )}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function CarouselBtn({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      className={`glass absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3"} grid place-items-center w-10 h-10 rounded-full text-[var(--color-ink)] cursor-pointer hover:bg-white/70 transition-colors`}
      aria-label={side === "left" ? "Previous image" : "Next image"}
    >
      <Icon size={20} />
    </button>
  );
}
