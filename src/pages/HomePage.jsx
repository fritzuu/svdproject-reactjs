import { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import UploadCard from "../components/upload/UploadCard";
import SettingsPanel from "../components/settings/SettingsPanel";
import BeforeAfterSection from "../components/comparison/BeforeAfterSection";
import { HistorySection } from "../components/history/HistoryTimeline";
import Drawer from "../components/ui/Drawer";
import HistoryTimeline from "../components/history/HistoryTimeline";
import { useCompression } from "../hooks/useCompression";
import { useHistory } from "../context/HistoryContext";

export default function HomePage() {
  const uploadRef = useRef(null);
  const learnRef = useRef(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { history } = useHistory();

  const {
    originalImages,
    compressedImages,
    meta,
    options,
    updateOptions,
    isCompressing,
    progress,
    stats,
    handleFilesSelected,
  } = useCompression();

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 dark:bg-surface-dark light:bg-surface-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),transparent_50%)]" />
      </div>

      <Navbar
        onHistoryOpen={() => setHistoryOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            "!glass !rounded-xl !text-slate-100 !border !border-white/10 light:!text-slate-900",
          duration: 3500,
        }}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroSection
          onStart={() => scrollTo(uploadRef)}
          onLearnMore={() => scrollTo(learnRef)}
        />

        <div ref={uploadRef} className="pb-8">
          <UploadCard
            onFilesSelected={handleFilesSelected}
            disabled={isCompressing}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <SettingsPanel options={options} updateOptions={updateOptions} />
            </div>
          </div>

          <div>
            <BeforeAfterSection
              originalImages={originalImages}
              compressedImages={compressedImages}
              meta={meta}
              isCompressing={isCompressing}
              progress={progress}
              stats={stats}
            />
          </div>
        </div>

        <div ref={learnRef}>
          <HistorySection history={history} />
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-500 light:border-slate-200">
        CompressAI — Premium image compression
      </footer>

      <Drawer open={historyOpen} onClose={() => setHistoryOpen(false)} title="Compression History">
        <HistoryTimeline history={history} compact />
      </Drawer>

      <Drawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Compression Settings"
        side="left"
      >
        <SettingsPanel options={options} updateOptions={updateOptions} className="!p-0 !shadow-none !border-0 !bg-transparent" />
      </Drawer>
    </div>
  );
}
