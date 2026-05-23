import { motion } from "framer-motion";

const variants = {
  primary:
    "gradient-brand text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
  secondary:
    "glass text-slate-200 light:text-slate-700 hover:bg-white/10 light:hover:bg-slate-100",
  ghost: "text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/5",
  outline:
    "border border-white/20 text-slate-200 light:border-slate-300 light:text-slate-700 hover:border-primary/50",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  size = "md",
  ...props
}) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm font-medium",
    lg: "px-8 py-3.5 text-base font-semibold",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 bg-white/20"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
}
