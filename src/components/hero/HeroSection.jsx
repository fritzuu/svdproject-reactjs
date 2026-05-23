import { motion } from "framer-motion";
import { HiArrowDown, HiSparkles } from "react-icons/hi";
import Button from "../ui/Button";
import GradientBlobs from "../layout/GradientBlobs";
import HeroParticles from "./HeroParticles";

export default function HeroSection({ onStart, onLearnMore }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-6 sm:pt-22 sm:pb-8 md:pt-24 md:pb-10">
      <GradientBlobs />
      <HeroParticles />
      <div className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur sm:text-sm light:border-slate-200 light:bg-white/80 light:text-slate-600"
        >
          <HiSparkles className="h-3.5 w-3.5 text-secondary sm:h-4 sm:w-4" />
          Smart AI-powered compression
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Compress Images{" "}
          <span className="gradient-text">Without Losing Quality</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base light:text-slate-600"
        >
          Reduce image size instantly while maintaining quality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Button
            size="xl"
            onClick={onStart}
            className="glow-ring w-full min-w-[220px] sm:w-auto"
          >
            Start Compressing
            <HiArrowDown className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={onLearnMore}
            className="w-full sm:w-auto"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
