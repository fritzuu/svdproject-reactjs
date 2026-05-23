import { motion } from "framer-motion";
import {
  HiOutlineClipboardCopy,
  HiOutlineDocumentDownload,
  HiOutlineFolderDownload,
} from "react-icons/hi";
import toast from "react-hot-toast";

function ActionButton({ children, onClick, icon: Icon, variant = "primary" }) {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 sm:text-base";
  const styles =
    variant === "primary"
      ? "gradient-brand text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
      : "border border-white/15 bg-white/5 text-slate-200 hover:border-primary/40 hover:bg-white/10 light:border-slate-200 light:text-slate-800 light:hover:bg-slate-50";

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${base} ${styles}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {children}
    </motion.button>
  );
}

export default function DownloadActions({
  compressed,
  onDownloadImage,
  onDownloadZip,
  zipOnly = false,
}) {
  const copyImageLink = async () => {
    if (!compressed) return;
    const url = URL.createObjectURL(compressed);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Image link copied (valid this session)");
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (!compressed) return null;

  if (zipOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 w-full md:mt-8"
      >
        <ActionButton icon={HiOutlineFolderDownload} onClick={onDownloadZip}>
          Download All as ZIP
        </ActionButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 flex w-full flex-col gap-3 sm:mt-8"
    >
      <ActionButton icon={HiOutlineDocumentDownload} onClick={onDownloadImage}>
        Download Image
      </ActionButton>
      <ActionButton
        variant="secondary"
        icon={HiOutlineClipboardCopy}
        onClick={copyImageLink}
      >
        Copy Image Link
      </ActionButton>
    </motion.div>
  );
}
