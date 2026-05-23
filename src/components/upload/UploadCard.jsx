import { motion } from "framer-motion";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { ACCEPTED_TYPES } from "../../utils/presets";

const FORMATS = ["PNG", "JPG", "WEBP", "AVIF"];

export default function UploadCard({ onFilesSelected, disabled }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted?.length) onFilesSelected(accepted);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    disabled,
  });

  return (
    <motion.div
      id="upload"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative mx-auto max-w-3xl"
    >
      <div
        className={`absolute -inset-[1px] rounded-[calc(var(--radius-card)+2px)] gradient-brand opacity-60 transition-opacity duration-300 ${
          isDragActive ? "opacity-100" : ""
        }`}
      />
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-[var(--radius-card)] glass-strong p-10 sm:p-14 transition-all duration-300 ${
          isDragActive ? "scale-[1.01]" : "hover:scale-[1.005]"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />

        {isDragActive && (
          <motion.span
            className="absolute inset-0 rounded-[var(--radius-card)] border-2 border-secondary/50"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={
              isDragAccept
                ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
                : { y: [0, -6, 0] }
            }
            transition={{
              duration: isDragAccept ? 0.6 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-brand shadow-[var(--shadow-glow)] ${
              isDragActive ? "shadow-secondary/40" : ""
            }`}
          >
            <HiOutlineCloudUpload className="h-10 w-10 text-white" />
          </motion.div>

          <h3 className="text-xl font-semibold sm:text-2xl">
            {isDragActive ? "Release to upload" : "Drop your images here"}
          </h3>
          <p className="mt-2 text-slate-400 light:text-slate-500">
            or{" "}
            <span className="font-medium text-primary light:text-primary-dark">
              click to browse
            </span>
          </p>

          <p className="mt-8 text-xs font-medium uppercase tracking-widest text-slate-500">
            Supports:{" "}
            {FORMATS.map((f, i) => (
              <span key={f}>
                {i > 0 && <span className="mx-1.5 text-slate-600">•</span>}
                {f}
              </span>
            ))}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
