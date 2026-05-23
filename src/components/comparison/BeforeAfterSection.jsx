import { AnimatePresence, motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import ComparisonCard from "./ComparisonCard";
import StatsBar from "./StatsBar";
import Button from "../ui/Button";
import { downloadAsZip } from "../../services/zipService";

export default function BeforeAfterSection({
  originalImages,
  compressedImages,
  meta,
  isCompressing,
  progress,
  stats,
}) {
  if (originalImages.length === 0) return null;

  const handleDownloadAll = async () => {
    try {
      await downloadAsZip(compressedImages);
      toast.success("ZIP downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <section id="compare" className="mt-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-2xl font-bold sm:text-3xl"
      >
        Before & After
      </motion.h2>

      <div className="space-y-12">
        {originalImages.map((orig, idx) => {
          const compressed = compressedImages[idx];
          const m = meta[idx];
          const origUrl = URL.createObjectURL(orig);

          return (
            <div key={`${orig.name}-${idx}`} className="space-y-6">
              <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center">
                <ComparisonCard
                  label="Before"
                  file={orig}
                  previewUrl={origUrl}
                  resolution={m?.resolution}
                  variant="before"
                />

                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex shrink-0 items-center justify-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-brand shadow-lg">
                    <HiArrowRight className="h-6 w-6 text-white" />
                  </div>
                </motion.div>

                <ComparisonCard
                  label="After"
                  file={compressed}
                  previewUrl={compressed ? URL.createObjectURL(compressed) : null}
                  resolution={m?.compressedResolution}
                  loading={isCompressing && !compressed}
                  variant="after"
                />
              </div>

              {compressed && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      saveAs(compressed, compressed.name);
                      toast.success("Image downloaded");
                    }}
                  >
                    Download {compressed.name}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StatsBar stats={stats} progress={progress} isCompressing={isCompressing} />

      <AnimatePresence>
        {compressedImages.length > 0 && !isCompressing && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <Button size="lg" onClick={handleDownloadAll}>
              Download All (ZIP)
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
