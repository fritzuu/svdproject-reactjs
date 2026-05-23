import { AnimatePresence, motion } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function Drawer({ open, onClose, title, children, side = "right" }) {
  const slideFrom = side === "right" ? { x: "100%" } : { x: "-100%" };
  const position =
    side === "right" ? "right-0 border-l" : "left-0 border-r";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`fixed top-0 ${position} z-50 flex h-full w-full max-w-full flex-col border-white/10 glass-strong shadow-2xl sm:max-w-md`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
              <h2 className="truncate pr-2 text-base font-semibold sm:text-lg">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
