import { motion } from "framer-motion";
import {
  HiLightningBolt,
  HiOutlineTrendingDown,
  HiOutlineSave,
} from "react-icons/hi";
import { formatBytes } from "../../utils/formatBytes";

function AnimatedValue({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="block"
    >
      {value}
    </motion.span>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="min-w-0 rounded-2xl border border-white/10 bg-slate-800/50 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-6 light:border-slate-200 light:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 ${color}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
      <p className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${color}`}>
        <AnimatedValue value={value} />
      </p>
      {sub && (
        <p className="mt-1 text-sm text-slate-500">{sub}</p>
      )}
    </motion.div>
  );
}

export default function StatsBar({ stats, progress, isCompressing }) {
  if (!stats && !isCompressing) return null;

  const items = stats
    ? [
        {
          label: "Saved",
          value: `${stats.savedPercent}%`,
          sub: "average reduction",
          icon: HiOutlineSave,
          color: "text-secondary",
        },
        {
          label: "Reduced",
          value: formatBytes(stats.reducedBytes),
          sub: "total file size cut",
          icon: HiOutlineTrendingDown,
          color: "text-primary",
        },
        {
          label: "Speed",
          value: `~${stats.speedMultiplier}x`,
          sub: "faster upload",
          icon: HiLightningBolt,
          color: "text-primary-dark",
        },
      ]
    : [];

  return (
    <div className="mt-8 space-y-6 sm:mt-10">
      {isCompressing && (
        <div className="min-w-0 rounded-2xl border border-white/10 bg-slate-800/40 p-4">
          <div className="mb-2 flex justify-between text-sm text-slate-400">
            <span>Compressing…</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800 light:bg-slate-200">
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
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {items.map((item, i) => (
            <MetricCard key={item.label} {...item} delay={i * 0.08} />
          ))}
        </div>
      )}
    </div>
  );
}
