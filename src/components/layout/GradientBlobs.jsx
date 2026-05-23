import { motion } from "framer-motion";

const blobs = [
  { className: "left-[10%] top-[15%] h-72 w-72 bg-primary/30", delay: 0 },
  { className: "right-[15%] top-[20%] h-96 w-96 bg-primary-dark/25", delay: 2 },
  { className: "left-[40%] bottom-[10%] h-80 w-80 bg-secondary/20", delay: 4 },
];

export default function GradientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}
      <motion.div
        className="absolute right-[8%] top-[45%] h-16 w-16 rounded-2xl border border-white/10 bg-white/5"
        animate={{ rotate: 360, y: [0, -12, 0] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity } }}
      />
      <motion.div
        className="absolute left-[20%] top-[55%] h-10 w-10 rounded-full border border-secondary/30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}
