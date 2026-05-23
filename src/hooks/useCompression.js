import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { compressImages } from "../services/compressionService";
import { getImageDimensions } from "../utils/imageMeta";
import { formatSavedPercent } from "../utils/formatBytes";
import { getFileKey } from "../utils/fileKey";

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
  const [previewMeta, setPreviewMeta] = useState([]);
  const [options, setOptions] = useState(defaultOptions);
  const [compressOptions, setCompressOptions] = useState(defaultOptions);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressError, setCompressError] = useState(null);
  const abortRef = useRef(false);
  const thumbUrlsRef = useRef([]);

  const revokeThumbs = useCallback(() => {
    thumbUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    thumbUrlsRef.current = [];
  }, []);

  const updateOptions = useCallback((patch) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const debounced = debounce(() => setCompressOptions(options), 450);
    debounced();
    return () => debounced.cancel();
  }, [options]);

  const handleFilesSelected = useCallback(
    (files) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) {
        toast.error("Please select valid image files");
        return;
      }
      revokeThumbs();
      setOriginalImages(list);
      setCompressedImages([]);
      setPreviewMeta([]);
      setCompressError(null);
      toast.success(`${list.length} image(s) ready to compress`);
    },
    [revokeThumbs]
  );

  useEffect(() => {
    if (originalImages.length === 0) return undefined;

    abortRef.current = false;

    const run = async () => {
      setIsCompressing(true);
      setProgress(0);
      setCompressError(null);
      const toastId = toast.loading("Compressing images...");

      try {
        const maxSize = compressOptions.resizeWidth
          ? parseInt(compressOptions.resizeWidth, 10)
          : compressOptions.maxSize;

        const compressed = await compressImages(
          originalImages,
          {
            ...compressOptions,
            maxSize: maxSize || compressOptions.maxSize,
          },
          setProgress
        );

        if (abortRef.current) return;

        const dimensions = await Promise.all(
          originalImages.map((f) => getImageDimensions(f))
        );
        const compressedDims = await Promise.all(
          compressed.map((f) => getImageDimensions(f))
        );

        revokeThumbs();
        const thumbs = compressed.map((f) => URL.createObjectURL(f));
        thumbUrlsRef.current = thumbs;

        const metaList = originalImages.map((orig, i) => ({
          fileKey: getFileKey(orig),
          name: orig.name,
          originalSize: orig.size,
          compressedSize: compressed[i].size,
          savedPercent: formatSavedPercent(orig.size, compressed[i].size),
          resolution: dimensions[i],
          compressedResolution: compressedDims[i],
          thumbnail: thumbs[i],
        }));

        setCompressedImages(compressed);
        setPreviewMeta(metaList);
        toast.success("Compression complete!", { id: toastId });
      } catch (err) {
        console.error(err);
        setCompressError(err?.message || "Compression failed");
        toast.error("Compression failed. Try again.", { id: toastId });
      } finally {
        setIsCompressing(false);
      }
    };

    run();
    return () => {
      abortRef.current = true;
    };
  }, [
    originalImages,
    compressOptions.quality,
    compressOptions.maxSize,
    compressOptions.maxSizeMB,
    compressOptions.format,
    compressOptions.preset,
    compressOptions.resizeWidth,
    revokeThumbs,
  ]);

  useEffect(() => () => revokeThumbs(), [revokeThumbs]);

  const stats = useMemo(() => {
    if (!previewMeta.length) return null;
    return {
      savedPercent: Math.round(
        previewMeta.reduce((a, m) => a + m.savedPercent, 0) / previewMeta.length
      ),
      reducedBytes: previewMeta.reduce(
        (a, m) => a + (m.originalSize - m.compressedSize),
        0
      ),
      speedMultiplier: 5,
    };
  }, [previewMeta]);

  const previewItems = useMemo(
    () =>
      originalImages.map((orig, idx) => ({
        original: orig,
        compressed: compressedImages[idx] ?? null,
        meta: previewMeta[idx] ?? null,
      })),
    [originalImages, compressedImages, previewMeta]
  );

  return {
    originalImages,
    compressedImages,
    previewMeta,
    previewItems,
    options,
    updateOptions,
    isCompressing,
    progress,
    stats,
    compressError,
    handleFilesSelected,
  };
}
