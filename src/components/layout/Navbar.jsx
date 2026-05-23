import { motion } from "framer-motion";
import { HiOutlineClock, HiOutlineCog, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { useScrollNavbar } from "../../hooks/useScrollNavbar";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16" strokeLinecap="round" />
          <path d="M14 8l2-2a2 2 0 012.8 0L20 7" strokeLinecap="round" />
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight">
        Compress<span className="gradient-text">AI</span>
      </span>
    </div>
  );
}

export default function Navbar({ onHistoryOpen, onSettingsOpen }) {
  const scrolled = useScrollNavbar();
  const { isDark, toggle } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-900/70 shadow-lg backdrop-blur-xl light:bg-white/80 light:border-slate-200/80"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="flex items-center gap-1 sm:gap-2">
          <IconButton onClick={toggle} label="Toggle theme">
            {isDark ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
          </IconButton>
          <IconButton onClick={onHistoryOpen} label="History">
            <HiOutlineClock className="h-5 w-5" />
          </IconButton>
          <IconButton onClick={onSettingsOpen} label="Settings" className="lg:hidden">
            <HiOutlineCog className="h-5 w-5" />
          </IconButton>
        </div>
      </nav>
    </motion.header>
  );
}

function IconButton({ children, onClick, label, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded-xl p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white light:hover:bg-slate-100 light:hover:text-slate-900 ${className}`}
    >
      {children}
    </motion.button>
  );
}
