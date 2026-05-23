import { motion } from "framer-motion";
import { formatBytes } from "../../utils/formatBytes";
import Skeleton from "../ui/Skeleton";

export default function ComparisonCard({
  label,
  file,
  previewUrl,
  resolution,
  loading,
  variant = "before",
}) {
  const isBefore = variant === "before";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`flex-1 overflow-hidden rounded-2xl border glass-strong ${
        isBefore ? "border-slate-600/30" : "border-primary/30 shadow-[var(--shadow-glow)]"
      }`}
    >
      <div
        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${
          isBefore
            ? "bg-slate-800/80 text-slate-400 light:bg-slate-100"
            : "gradient-brand text-white"
        }`}
      >
        {label}
      </div>

      <div className="p-4">
        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-slate-800/50 light:bg-slate-100">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt={file?.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              No preview
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <Row label="File" value={file?.name || "—"} truncate />
          <Row
            label="Resolution"
            value={
              resolution?.width
                ? `${resolution.width} × ${resolution.height}`
                : "—"
            }
          />
          <Row
            label="Size"
            value={file ? formatBytes(file.size) : "—"}
            highlight={!isBefore}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value, truncate, highlight }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span
        className={`font-medium ${truncate ? "max-w-[60%] truncate" : ""} ${
          highlight ? "text-secondary" : "text-slate-200 light:text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
