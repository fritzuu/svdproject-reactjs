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
    previewItems,
    originalImages,
    compressedImages,
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

  const hasImages = previewItems.length > 0;
  const isSuccess =
    hasImages && compressedImages.length > 0 && !isCompressing;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 dark:bg-surface-dark light:bg-surface-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),transparent_55%)]" />
      </div>

      <Navbar
        onHistoryOpen={() => setHistoryOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            "!glass !rounded-xl !text-slate-100 !border !border-white/10 light:!text-slate-900 !max-w-[calc(100vw-2rem)]",
          duration: 3500,
        }}
      />

      <main className="container-app">
        <HeroSection
          onStart={() => scrollTo(uploadRef)}
          onLearnMore={() => scrollTo(learnRef)}
        />

        <div ref={uploadRef} className="mt-6 md:mt-8">
          <UploadCard
            onFilesSelected={handleFilesSelected}
            disabled={isCompressing}
            isUploading={isCompressing}
            uploadProgress={progress}
            isSuccess={isSuccess}
            fileCount={originalImages.length}
          />
        </div>

        {hasImages && (
          <div className="section-gap grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-[minmax(380px,420px)_1fr] lg:gap-8">
            <aside className="min-w-0">
              <div className="md:sticky md:top-20 xl:top-24">
                <div className="hidden md:block">
                  <SettingsPanel
                    options={options}
                    updateOptions={updateOptions}
                  />
                </div>
                <p className="mt-3 text-center text-xs text-slate-500 md:hidden">
                  Open settings via toolbar icon on mobile
                </p>
              </div>
            </aside>

            <div className="min-w-0">
              <BeforeAfterSection
                previewItems={previewItems}
                isCompressing={isCompressing}
                progress={progress}
                stats={stats}
              />
            </div>
          </div>
        )}

        <div ref={learnRef} className="min-w-0">
          <HistorySection history={history} />
        </div>
      </main>

      <footer className="container-app border-t border-white/5 py-8 text-center text-xs text-slate-500 sm:text-sm light:border-slate-200">
        CompressAI — Premium image compression
      </footer>

      <Drawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Compression History"
      >
        <HistoryTimeline history={history} compact />
      </Drawer>

      <Drawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Compression Settings"
        side="left"
      >
        <SettingsPanel
          options={options}
          updateOptions={updateOptions}
          className="!border-0 !bg-transparent !p-0 !shadow-none"
        />
      </Drawer>
    </div>
  );
}
