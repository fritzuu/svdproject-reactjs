import { motion } from "framer-motion";
import ComparisonPreview from "./ComparisonPreview";
import StatsBar from "./StatsBar";
import DownloadActions from "../download/DownloadActions";
import { useObjectUrls } from "../../hooks/useObjectUrls";
import { useDownloadHistory } from "../../hooks/useDownloadHistory";

export default function BeforeAfterSection({
  previewItems,
  isCompressing,
  progress,
  stats,
}) {
  const { downloadSingle, downloadAllZip } = useDownloadHistory();
  const originals = previewItems.map((p) => p.original);
  const compressedList = previewItems.map((p) => p.compressed).filter(Boolean);
  const originalUrls = useObjectUrls(originals);
  const compressedUrls = useObjectUrls(compressedList);

  if (!previewItems.length) return null;

  const getCompressedUrl = (compressed) => {
    if (!compressed) return null;
    const idx = compressedList.findIndex(
      (f) =>
        f.name === compressed.name &&
        f.size === compressed.size &&
        f.lastModified === compressed.lastModified
    );
    return idx >= 0 ? compressedUrls[idx] : null;
  };

  const validItems = previewItems.filter((p) => p.compressed && p.meta);

  return (
    <section id="compare" className="min-w-0">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 text-xl font-bold sm:mb-8 sm:text-2xl md:text-3xl"
      >
        Preview & Results
      </motion.h2>

      <div className="space-y-8 md:space-y-10">
        {previewItems.map((item, idx) => {
          const { original, compressed, meta } = item;
          const afterUrl = getCompressedUrl(compressed);

          return (
            <div key={meta?.fileKey ?? `${original.name}-${idx}`} className="min-w-0">
              <ComparisonPreview
                original={original}
                compressed={compressed}
                meta={meta}
                beforeUrl={originalUrls[idx]}
                afterUrl={afterUrl}
                loading={isCompressing && !compressed}
              />

              {compressed && meta && !isCompressing && (
                <DownloadActions
                  compressed={compressed}
                  onDownloadImage={() => downloadSingle(meta, compressed)}
                />
              )}
            </div>
          );
        })}
      </div>

      <StatsBar stats={stats} progress={progress} isCompressing={isCompressing} />

      {validItems.length > 1 && !isCompressing && (
        <DownloadActions
          compressed={validItems[0].compressed}
          zipOnly
          onDownloadZip={() =>
            downloadAllZip(
              validItems.map((p) => ({ meta: p.meta, compressed: p.compressed }))
            )
          }
        />
      )}
    </section>
  );
}
