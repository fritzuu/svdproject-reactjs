import { motion } from "framer-motion";
import { HiLightningBolt, HiTrendingDown } from "react-icons/hi";
import { formatBytes } from "../../utils/formatBytes";

export default function StatsBar({ stats, progress, isCompressing }) {
  if (!stats && !isCompressing) return null;

  const items = stats
    ? [
        { label: "Saved", value: `${stats.savedPercent}%`, icon: HiTrendingDown, color: "text-secondary" },
        { label: "Reduce", value: formatBytes(stats.reducedBytes), icon: HiTrendingDown, color: "text-primary" },
        { label: "Speed", value: `~${stats.speedMultiplier}x faster upload`, icon: HiLightningBolt, color: "text-primary-dark" },
      ]
    : [];

  return (
    <div className="mt-8 space-y-4">
      {isCompressing && (
        <div>
          <div className="mb-2 flex justify-between text-xs text-slate-400">
            <span>Compressing...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800 light:bg-slate-200">
            <motion.div
              className="h-full gradient-brand"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-slate-800/40 p-4 light:border-slate-200 light:bg-white"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                {item.label}
              </div>
              <p className={`mt-1 text-lg font-bold ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
