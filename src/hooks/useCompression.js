import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { compressImages } from "../services/compressionService";
import { getImageDimensions } from "../utils/imageMeta";
import { formatSavedPercent } from "../utils/formatBytes";
import { useHistory } from "../context/HistoryContext";

const defaultOptions = {
  quality: 0.75,
  maxSize: 1920,
  maxSizeMB: 2,
  format: "webp",
  preset: "balanced",
  resizeWidth: "",
  resizeHeight: "",
};

export function useCompression() {
  const [originalImages, setOriginalImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [meta, setMeta] = useState([]);
  const [options, setOptions] = useState(defaultOptions);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addEntry } = useHistory();
  const abortRef = useRef(false);

  const updateOptions = useCallback((patch) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleFilesSelected = useCallback(async (files) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      toast.error("Please select valid image files");
      return;
    }
    setOriginalImages(list);
    setCompressedImages([]);
    setMeta([]);
    toast.success(`${list.length} image(s) ready to compress`);
  }, []);

  useEffect(() => {
    if (originalImages.length === 0) return;

    abortRef.current = false;

    const run = async () => {
      setIsCompressing(true);
      setProgress(0);
      const toastId = toast.loading("Compressing images...");

      try {
        const maxSize = options.resizeWidth
          ? parseInt(options.resizeWidth, 10)
          : options.maxSize;

        const compressed = await compressImages(
          originalImages,
          { ...options, maxSize: maxSize || options.maxSize },
          setProgress
        );

        if (abortRef.current) return;

        const dimensions = await Promise.all(
          originalImages.map((f) => getImageDimensions(f))
        );
        const compressedDims = await Promise.all(
          compressed.map((f) => getImageDimensions(f))
        );

        const metaList = originalImages.map((orig, i) => ({
          name: orig.name,
          originalSize: orig.size,
          compressedSize: compressed[i].size,
          savedPercent: formatSavedPercent(orig.size, compressed[i].size),
          resolution: dimensions[i],
          compressedResolution: compressedDims[i],
          thumbnail: URL.createObjectURL(compressed[i]),
        }));

        setCompressedImages(compressed);
        setMeta(metaList);

        metaList.forEach((m, i) => {
          addEntry({
            fileName: compressed[i].name,
            originalSize: m.originalSize,
            compressedSize: m.compressedSize,
            savedPercent: m.savedPercent,
            thumbnail: m.thumbnail,
          });
        });

        toast.success("Compression complete!", { id: toastId });
      } catch (err) {
        console.error(err);
        toast.error("Compression failed. Try again.", { id: toastId });
      } finally {
        setIsCompressing(false);
      }
    };

    run();
    return () => {
      abortRef.current = true;
    };
  }, [originalImages, options.quality, options.maxSize, options.maxSizeMB, options.format, options.preset, options.resizeWidth]);

  const stats = meta.length
    ? {
        savedPercent: Math.round(
          meta.reduce((a, m) => a + m.savedPercent, 0) / meta.length
        ),
        reducedBytes: meta.reduce(
          (a, m) => a + (m.originalSize - m.compressedSize),
          0
        ),
        speedMultiplier: 5,
      }
    : null;

  return {
    originalImages,
    compressedImages,
    meta,
    options,
    updateOptions,
    isCompressing,
    progress,
    stats,
    handleFilesSelected,
    setOriginalImages,
  };
}
