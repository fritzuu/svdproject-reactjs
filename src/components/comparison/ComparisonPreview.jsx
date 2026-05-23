import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineArrowsExpand,
  HiOutlinePhotograph,
  HiX,
} from "react-icons/hi";
import ImageCompareSlider from "./ImageCompareSlider";
import { formatBytes } from "../../utils/formatBytes";

export default function ComparisonPreview({
  original,
  compressed,
  meta,
  beforeUrl,
  afterUrl,
  loading,
}) {
  const [zoomOpen, setZoomOpen] = useState(false);

  const ratio =
    meta?.originalSize && meta?.compressedSize
      ? `${((meta.compressedSize / meta.originalSize) * 100).toFixed(1)}% of original`
      : "—";

  const stats = [
    { label: "Original size", value: formatBytes(meta?.originalSize) },
    { label: "Compressed size", value: formatBytes(meta?.compressedSize) },
    { label: "Compression ratio", value: ratio, accent: true },
    {
      label: "Resolution",
      value: meta?.resolution?.width
        ? `${meta.resolution.width} × ${meta.resolution.height}`
        : "—",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 overflow-hidden rounded-2xl border border-white/10 glass-strong transition-shadow duration-300 hover:shadow-[var(--shadow-glow)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <HiOutlinePhotograph className="h-5 w-5 shrink-0 text-primary" />
          <p
            className="truncate text-sm font-semibold sm:text-base"
            title={original?.name}
          >
            {original?.name}
          </p>
        </div>
        {afterUrl && !loading && (
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-primary/40 hover:text-white"
          >
            <HiOutlineArrowsExpand className="h-4 w-4" />
            Zoom
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        {loading || !afterUrl ? (
          <div className="flex aspect-[4/3] min-h-[280px] items-center justify-center rounded-2xl bg-slate-800/50 sm:min-h-[360px] md:min-h-[420px]">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm text-slate-400"
            >
              Compressing preview…
            </motion.div>
          </div>
        ) : (
          <ImageCompareSlider
            beforeUrl={beforeUrl}
            afterUrl={afterUrl}
            alt={original?.name}
          />
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2.5 light:border-slate-200 light:bg-slate-50"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">
                {s.label}
              </p>
              <p
                className={`mt-0.5 truncate text-sm font-bold sm:text-base ${
                  s.accent ? "text-secondary" : "text-slate-100 light:text-slate-900"
                }`}
                title={s.value}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && afterUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setZoomOpen(false)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
            >
              <HiX className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={afterUrl}
              alt="Zoom preview"
              className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
