import { motion } from "framer-motion";

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="relative flex min-w-0 rounded-xl bg-slate-800/50 p-1 light:bg-slate-100">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative min-w-0 flex-1 rounded-lg px-1.5 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors sm:px-3 sm:text-xs ${
              active
                ? "text-white"
                : "text-slate-400 hover:text-slate-200 light:hover:text-slate-700"
            }`}
          >
            {active && (
              <motion.span
                layoutId="segment-bg"
                className="absolute inset-0 rounded-lg gradient-brand shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
