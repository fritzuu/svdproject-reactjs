import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import SegmentedControl from "../ui/SegmentedControl";
import { PRESETS } from "../../utils/presets";

const FORMAT_OPTIONS = [
  { label: "JPG", value: "jpg" },
  { label: "PNG", value: "png" },
  { label: "WEBP", value: "webp" },
  { label: "AVIF", value: "avif" },
];

export default function SettingsPanel({ options, updateOptions, className = "" }) {
  const applyPreset = (preset) => {
    updateOptions({
      preset: preset.id,
      quality: preset.quality,
      maxSize: preset.maxSize,
      maxSizeMB: preset.maxSizeMB,
    });
  };

  return (
    <GlassCard id="settings" className={className}>
      <h2 className="mb-6 text-lg font-semibold">Compression Settings</h2>

      <div className="space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300 light:text-slate-600">
              Quality
            </label>
            <span className="rounded-lg bg-primary/20 px-2.5 py-0.5 text-sm font-semibold text-primary">
              {Math.round(options.quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={options.quality}
            onChange={(e) =>
              updateOptions({ quality: parseFloat(e.target.value), preset: "custom" })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700/80 accent-primary light:bg-slate-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-slate-300 light:text-slate-600">
            Format
          </label>
          <SegmentedControl
            options={FORMAT_OPTIONS}
            value={options.format}
            onChange={(format) => updateOptions({ format })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-600">
              Width (px)
            </label>
            <input
              type="number"
              placeholder="Auto"
              value={options.resizeWidth}
              onChange={(e) => updateOptions({ resizeWidth: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 light:border-slate-200 light:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-600">
              Height (px)
            </label>
            <input
              type="number"
              placeholder="Auto"
              value={options.resizeHeight}
              onChange={(e) => updateOptions({ resizeHeight: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 light:border-slate-200 light:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-slate-300 light:text-slate-600">
            Preset
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PRESETS.map((preset) => {
              const active = options.preset === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyPreset(preset)}
                  className={`group relative rounded-xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-primary/60 bg-primary/10 shadow-[var(--shadow-glow)]"
                      : "border-white/10 bg-slate-800/30 hover:border-primary/40 hover:shadow-lg light:border-slate-200 light:bg-slate-50 light:hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "border-primary bg-primary" : "border-slate-500"
                      }`}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <div>
                      <p className="font-medium text-slate-100 light:text-slate-900">
                        {preset.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{preset.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
