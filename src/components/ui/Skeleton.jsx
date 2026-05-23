import { motion } from "framer-motion";

export default function Skeleton({ className = "" }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`rounded-xl bg-slate-700/40 light:bg-slate-200 ${className}`}
    />
  );
}
