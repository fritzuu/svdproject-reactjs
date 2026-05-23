import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`glass rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-soft)] ${
        hover ? "hover-lift cursor-default" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
