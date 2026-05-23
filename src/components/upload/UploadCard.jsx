import { motion, AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  HiOutlineCheckCircle,
  HiOutlineCloudUpload,
  HiOutlineRefresh,
} from "react-icons/hi";
import { ACCEPTED_TYPES } from "../../utils/presets";

const FORMATS = ["PNG", "JPG", "WEBP", "AVIF"];

export default function UploadCard({
  onFilesSelected,
  disabled,
  isUploading = false,
  uploadProgress = 0,
  isSuccess = false,
  fileCount = 0,
}) {
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
    disabled: disabled || isUploading,
  });

  const state = isUploading
    ? "uploading"
    : isSuccess
      ? "success"
      : isDragActive
        ? "drag"
        : "idle";

  return (
    <motion.div
      id="upload"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative w-full min-w-0"
    >
      <div
        className={`absolute -inset-[1px] rounded-[calc(var(--radius-card)+2px)] gradient-brand transition-opacity duration-300 ${
          state === "drag" ? "opacity-100" : state === "success" ? "opacity-80" : "opacity-50"
        }`}
      />
      <div
        {...getRootProps()}
        className={`relative min-h-[200px] cursor-pointer rounded-[var(--radius-card)] glass-strong transition-all duration-300 sm:min-h-[240px] md:min-h-[280px] ${
          state === "drag" ? "scale-[1.01] glow-ring" : "hover:scale-[1.005]"
        } ${disabled && !isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {state === "drag" && (
            <motion.span
              key="drag-pulse"
              className="absolute inset-0 rounded-[var(--radius-card)] border-2 border-secondary/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-12 md:py-14">
          <motion.div
            animate={
              state === "drag"
                ? { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }
                : state === "success"
                  ? { scale: 1 }
                  : { y: [0, -8, 0] }
            }
            transition={{
              duration: state === "drag" ? 0.6 : 3,
              repeat: state === "success" ? 0 : Infinity,
            }}
            className={`mb-5 flex h-24 w-24 items-center justify-center rounded-2xl shadow-[var(--shadow-glow)] sm:h-28 sm:w-28 ${
              state === "success"
                ? "bg-emerald-500/20 ring-2 ring-emerald-400/50"
                : "gradient-brand"
            }`}
          >
            {state === "success" ? (
              <HiOutlineCheckCircle className="h-12 w-12 text-emerald-400 sm:h-14 sm:w-14" />
            ) : state === "uploading" ? (
              <HiOutlineRefresh className="h-12 w-12 animate-spin text-white" />
            ) : (
              <HiOutlineCloudUpload className="h-12 w-12 text-white sm:h-14 sm:w-14" />
            )}
          </motion.div>

          <h3 className="text-xl font-semibold sm:text-2xl md:text-3xl">
            {state === "drag" && "Release to upload"}
            {state === "uploading" && "Compressing your images…"}
            {state === "success" && `${fileCount} image${fileCount !== 1 ? "s" : ""} ready`}
            {state === "idle" && "Drop your images here"}
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-400 sm:text-base light:text-slate-500">
            {state === "uploading" && "Smart compression in progress"}
            {state === "success" && "Adjust settings or download below"}
            {state !== "uploading" && state !== "success" && (
              <>
                or{" "}
                <span className="font-semibold text-primary light:text-primary-dark">
                  click to browse
                </span>
              </>
            )}
          </p>

          {(state === "uploading" || state === "success") && (
            <div className="mt-6 w-full max-w-md">
              <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                <span>{state === "uploading" ? "Processing" : "Complete"}</span>
                <span>{Math.round(state === "success" ? 100 : uploadProgress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800/80 light:bg-slate-200">
                <motion.div
                  className={`h-full rounded-full ${state === "success" ? "bg-emerald-500" : "gradient-brand"}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${state === "success" ? 100 : uploadProgress}%`,
                  }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {state === "idle" && (
            <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:mt-8 sm:text-xs">
              <span>Supports</span>
              {FORMATS.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-slate-400"
                >
                  {f}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
