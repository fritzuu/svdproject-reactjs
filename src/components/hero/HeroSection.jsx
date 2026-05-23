import { motion } from "framer-motion";
import { HiArrowDown, HiSparkles } from "react-icons/hi";
import Button from "../ui/Button";
import GradientBlobs from "../layout/GradientBlobs";

export default function HeroSection({ onStart, onLearnMore }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      <GradientBlobs />
      <div className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur light:border-slate-200 light:bg-white/80 light:text-slate-600"
        >
          <HiSparkles className="h-4 w-4 text-secondary" />
          Smart AI-powered compression
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Compress Images
          <br />
          <span className="gradient-text">Without Losing Quality</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg light:text-slate-600"
        >
          Reduce image size instantly with smart compression technology while
          maintaining image quality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" onClick={onStart}>
            Start Compressing
            <HiArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" onClick={onLearnMore}>
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
