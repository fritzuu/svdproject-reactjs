export const PRESETS = [
  {
    id: "highQuality",
    label: "High Quality",
    description: "Best visual fidelity",
    quality: 0.9,
    maxSize: 3000,
    maxSizeMB: 5,
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Quality & size balance",
    quality: 0.75,
    maxSize: 1920,
    maxSizeMB: 2,
  },
  {
    id: "maximumCompression",
    label: "Maximum Compression",
    description: "Smallest file size",
    quality: 0.5,
    maxSize: 1280,
    maxSizeMB: 0.5,
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "1080px square-ready",
    quality: 0.8,
    maxSize: 1080,
    maxSizeMB: 1,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Fast sharing",
    quality: 0.7,
    maxSize: 1600,
    maxSizeMB: 1,
  },
  {
    id: "email",
    label: "Email",
    description: "Light attachments",
    quality: 0.6,
    maxSize: 1024,
    maxSizeMB: 0.5,
  },
  {
    id: "website",
    label: "Website",
    description: "Web-optimized",
    quality: 0.75,
    maxSize: 1920,
    maxSizeMB: 1.5,
  },
];

export const FORMAT_MIME = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export const ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
};
