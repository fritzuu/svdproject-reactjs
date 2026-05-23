import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { formatBytes } from "../../utils/formatBytes";
import {
  HISTORY_STATUS,
  HISTORY_STATUS_LABEL,
} from "../../constants/historyStatus";
import GlassCard from "../ui/GlassCard";

function StatusBadge({ status }) {
  const styles = {
    [HISTORY_STATUS.PROCESSING]:
      "bg-amber-500/15 text-amber-400 border-amber-500/30",
    [HISTORY_STATUS.DOWNLOADED]:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    [HISTORY_STATUS.FAILED]:
      "bg-red-500/15 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${
        styles[status] ?? styles[HISTORY_STATUS.PROCESSING]
      }`}
    >
      {HISTORY_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

export default function HistoryTimeline({ history, compact = false }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !search.trim() ||
        item.fileName?.toLowerCase().includes(search.trim().toLowerCase());
      const status = item.status ?? HISTORY_STATUS.DOWNLOADED;
      const matchStatus =
        statusFilter === "all" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [history, search, statusFilter]);

  if (!history.length) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No history yet. Download a compressed image to save it here.
      </p>
    );
  }

  return (
    <div className="min-w-0 space-y-4">
      {!compact && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search by file name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 light:border-slate-200 light:bg-white"
            />
          </div>
          <div className="relative shrink-0 sm:w-44">
            <HiOutlineFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/50 py-2.5 pl-10 pr-8 text-sm outline-none focus:border-primary/50 light:border-slate-200 light:bg-white"
            >
              <option value="all">All status</option>
              <option value={HISTORY_STATUS.DOWNLOADED}>Downloaded</option>
              <option value={HISTORY_STATUS.PROCESSING}>Processing</option>
              <option value={HISTORY_STATUS.FAILED}>Failed</option>
            </select>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No matches found.</p>
      ) : (
        <div
          className={`grid gap-3 sm:gap-4 ${
            compact
              ? ""
              : "max-h-[min(560px,65vh)] overflow-y-auto overflow-x-hidden pr-1 md:grid-cols-2"
          }`}
        >
          {filtered.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="flex min-w-0 gap-3 rounded-2xl border border-white/10 bg-slate-800/40 p-4 transition-shadow hover:shadow-[var(--shadow-soft)] light:border-slate-200 light:bg-slate-50 sm:gap-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-700 sm:h-24 sm:w-24 light:bg-slate-200">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl opacity-50">
                    🖼
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p
                    className="min-w-0 flex-1 break-all text-sm font-semibold sm:text-base"
                    title={item.fileName}
                  >
                    {item.fileName}
                  </p>
                  <StatusBadge
                    status={item.status ?? HISTORY_STATUS.DOWNLOADED}
                  />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(item.updatedAt ?? item.createdAt ?? item.timestamp)}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-[10px] sm:text-xs light:border-slate-200">
                  <Stat label="Original" value={formatBytes(item.originalSize)} />
                  <Stat
                    label="Compressed"
                    value={
                      item.compressedSize
                        ? formatBytes(item.compressedSize)
                        : "—"
                    }
                  />
                  <Stat
                    label="Saved"
                    value={
                      item.savedPercent != null ? `${item.savedPercent}%` : "—"
                    }
                    accent
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="min-w-0">
      <p className="text-slate-500">{label}</p>
      <p
        className={`truncate font-bold ${
          accent ? "text-secondary" : "text-slate-200 light:text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function HistorySection({ history }) {
  return (
    <section id="history" className="section-gap min-w-0 pb-16 sm:pb-20 md:pb-24">
      <GlassCard className="min-w-0 !p-5 sm:!p-7 md:!p-8">
        <h2 className="text-xl font-bold sm:text-2xl">Recent Compression</h2>
        <p className="mt-1 text-sm text-slate-500">
          Files you downloaded appear here
        </p>
        <div className="mt-6">
          <HistoryTimeline history={history} />
        </div>
      </GlassCard>
    </section>
  );
}
