import { motion } from "framer-motion";
import {
  HiOutlineAdjustments,
  HiOutlineDocument,
  HiOutlinePhotograph,
  HiOutlineTemplate,
} from "react-icons/hi";
import GlassCard from "../ui/GlassCard";
import SegmentedControl from "../ui/SegmentedControl";
import { PRESETS } from "../../utils/presets";

const FORMAT_OPTIONS = [
  { label: "JPG", value: "jpg" },
  { label: "PNG", value: "png" },
  { label: "WEBP", value: "webp" },
  { label: "AVIF", value: "avif" },
];

function Section({ icon: Icon, title, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-3 light:border-slate-200">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300 light:text-slate-700">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

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
    <GlassCard id="settings" className={`min-w-0 !p-5 sm:!p-6 md:!p-7 ${className}`}>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-md">
          <HiOutlineAdjustments className="h-5 w-5 text-white" />
        </span>
        <div>
          <h2 className="text-lg font-bold sm:text-xl">Compression Settings</h2>
          <p className="text-xs text-slate-500 sm:text-sm">Tune output quality & format</p>
        </div>
      </div>

      <div className="space-y-8">
        <Section icon={HiOutlineAdjustments} title="Quality">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Output quality</span>
            <span className="rounded-lg bg-primary/20 px-3 py-1 text-sm font-bold text-primary">
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
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700/80 accent-primary light:bg-slate-200 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
          />
        </Section>

        <Section icon={HiOutlineDocument} title="Format">
          <SegmentedControl
            options={FORMAT_OPTIONS}
            value={options.format}
            onChange={(format) => updateOptions({ format })}
          />
        </Section>

        <Section icon={HiOutlinePhotograph} title="Resize">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Width (px)
              </label>
              <input
                type="number"
                placeholder="Auto"
                value={options.resizeWidth}
                onChange={(e) => updateOptions({ resizeWidth: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 light:border-slate-200 light:bg-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Height (px)
              </label>
              <input
                type="number"
                placeholder="Auto"
                value={options.resizeHeight}
                onChange={(e) => updateOptions({ resizeHeight: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 light:border-slate-200 light:bg-white"
              />
            </div>
          </div>
        </Section>

        <Section icon={HiOutlineTemplate} title="Preset">
          <div className="grid grid-cols-1 gap-2.5">
            {PRESETS.map((preset) => {
              const active = options.preset === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => applyPreset(preset)}
                  className={`w-full rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
                    active
                      ? "border-primary/60 bg-primary/15 shadow-[var(--shadow-glow)]"
                      : "border-white/10 bg-slate-800/30 hover:border-primary/35 hover:bg-slate-800/50 light:border-slate-200 light:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "border-primary bg-primary" : "border-slate-600"
                      }`}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-100 light:text-slate-900">
                        {preset.label}
                      </p>
                      <p className="text-xs text-slate-500">{preset.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Section>
      </div>
    </GlassCard>
  );
}
