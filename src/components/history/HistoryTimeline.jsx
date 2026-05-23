import { motion } from "framer-motion";
import { formatBytes } from "../../utils/formatBytes";
import GlassCard from "../ui/GlassCard";

export default function HistoryTimeline({ history, compact = false }) {
  if (!history.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No compression history yet. Compress an image to see it here.
      </p>
    );
  }

  return (
    <div className={`space-y-4 ${compact ? "" : "max-h-[480px] overflow-y-auto pr-2"}`}>
      {history.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex gap-4 rounded-xl border border-white/10 bg-slate-800/30 p-4 light:border-slate-200 light:bg-slate-50"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-700 light:bg-slate-200">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl">🖼</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-200 light:text-slate-900">
              {item.fileName}
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <Stat label="Original" value={formatBytes(item.originalSize)} />
              <Stat label="Compressed" value={formatBytes(item.compressedSize)} />
              <Stat
                label="Saved"
                value={`${item.savedPercent}%`}
                accent
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p
        className={`font-semibold ${
          accent ? "text-secondary" : "text-slate-300 light:text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function HistorySection({ history }) {
  return (
    <section id="history" className="mt-20 pb-24">
      <GlassCard>
        <h2 className="mb-6 text-xl font-bold">Recent Compression</h2>
        <HistoryTimeline history={history} />
      </GlassCard>
    </section>
  );
}
