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
      className={`min-w-0 w-full overflow-hidden rounded-2xl border glass-strong ${
        isBefore ? "border-slate-600/30" : "border-primary/30 shadow-[var(--shadow-glow)]"
      }`}
    >
      <div
        className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest sm:px-4 sm:text-xs ${
          isBefore
            ? "bg-slate-800/80 text-slate-400 light:bg-slate-100"
            : "gradient-brand text-white"
        }`}
      >
        {label}
      </div>

      <div className="p-3 sm:p-4">
        <div className="relative mb-3 aspect-video max-h-48 overflow-hidden rounded-xl bg-slate-800/50 sm:mb-4 sm:max-h-56 light:bg-slate-100 md:max-h-64">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt={file?.name ?? "preview"}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No preview
            </div>
          )}
        </div>

        <div className="space-y-2 text-xs sm:text-sm">
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
    <div className="flex min-w-0 items-start justify-between gap-2">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span
        className={`min-w-0 text-right font-medium ${
          truncate ? "break-all" : ""
        } ${
          highlight ? "text-secondary" : "text-slate-200 light:text-slate-800"
        }`}
        title={truncate ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}
