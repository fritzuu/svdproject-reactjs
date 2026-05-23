import imageCompression from "browser-image-compression";
import { FORMAT_MIME } from "../utils/presets";

export async function compressImage(file, options) {
  const { quality, maxSize, maxSizeMB, format } = options;
  let fileType = FORMAT_MIME[format] || "image/jpeg";

  if (format === "avif" && typeof createImageBitmap === "undefined") {
    fileType = "image/webp";
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: maxSizeMB ?? 2,
    maxWidthOrHeight: maxSize,
    initialQuality: quality,
    fileType,
    useWebWorker: true,
  });

  const ext = format === "jpg" ? "jpg" : format;
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const renamed = new File([compressed], `${baseName}.${ext}`, {
    type: compressed.type,
    lastModified: Date.now(),
  });

  return renamed;
}

export async function compressImages(files, options, onProgress) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const result = await compressImage(files[i], options);
    results.push(result);
    onProgress?.(((i + 1) / files.length) * 100);
  }
  return results;
}
