import { useCallback, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function ImageCompareSlider({ beforeUrl, afterUrl, alt = "compare" }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromClientX(e.clientX);
  };

  if (!beforeUrl || !afterUrl) return null;

  return (
    <div
      ref={containerRef}
      className="group relative w-full select-none overflow-hidden rounded-2xl bg-slate-900/80 light:bg-slate-100"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      role="slider"
      aria-valuenow={Math.round(position)}
      aria-label="Compare before and after"
    >
      <div className="relative aspect-[4/3] min-h-[280px] w-full sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px]">
        <img
          src={afterUrl}
          alt={`${alt} after`}
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          draggable={false}
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeUrl}
            alt={`${alt} before`}
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 cursor-ew-resize bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full gradient-brand shadow-xl ring-4 ring-white/25">
            <HiChevronLeft className="h-4 w-4 text-white" />
            <HiChevronRight className="h-4 w-4 text-white -ml-1" />
          </div>
        </div>

        <span className="absolute left-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur sm:text-xs">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-lg bg-primary/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur sm:text-xs">
          After
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="sr-only"
        aria-label="Comparison position"
      />
    </div>
  );
}
