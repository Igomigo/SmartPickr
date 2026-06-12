import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { settleSoft } from "../design/motion";

interface ImageLightboxProps {
  open: boolean;
  images: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/**
 * A full-screen, uncropped image viewer (object-contain so the whole image is
 * visible — never cropped). Prev/next + dots when there's more than one.
 * Presentational and reusable; the owner holds the current index.
 */
export function ImageLightbox({ open, images, index, onIndex, onClose }: ImageLightboxProps) {
  const go = (delta: number) => onIndex((index + delta + images.length) % images.length);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/90"
        >
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={settleSoft}
            src={images[index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[88vh] w-auto h-auto object-contain rounded-[10px]"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <Nav side="left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
              <Nav side="right" onClick={(e) => { e.stopPropagation(); go(1); }} />
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Nav({ side, onClick }: { side: "left" | "right"; onClick: (e: React.MouseEvent) => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-4" : "right-4"} grid place-items-center w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer`}
    >
      <Icon size={22} />
    </button>
  );
}
