import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { HISTORY_STATUS } from "../constants/historyStatus";

const STORAGE_KEY = "compressai-history";
const MAX_ITEMS = 20;

const HistoryContext = createContext(null);

function stripThumbnail(entry) {
  const { thumbnail, ...rest } = entry;
  return rest;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  const stored = items.map(stripThumbnail).slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(loadHistory);

  const upsertEntry = useCallback((entry) => {
    setHistory((prev) => {
      const idx = prev.findIndex((h) => h.fileKey === entry.fileKey);
      let next;

      if (idx >= 0) {
        next = [...prev];
        next[idx] = {
          ...next[idx],
          ...entry,
          id: next[idx].id,
          updatedAt: Date.now(),
        };
      } else {
        next = [
          {
            ...entry,
            id: entry.id ?? crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          ...prev,
        ];
      }

      const trimmed = next.slice(0, MAX_ITEMS);
      saveToStorage(trimmed);
      return trimmed;
    });
  }, []);

  const updateEntryStatus = useCallback((fileKey, status, patch = {}) => {
    setHistory((prev) => {
      const idx = prev.findIndex((h) => h.fileKey === fileKey);
      if (idx < 0) return prev;

      const next = [...prev];
      next[idx] = {
        ...next[idx],
        ...patch,
        status,
        updatedAt: Date.now(),
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  const value = useMemo(
    () => ({ history, upsertEntry, updateEntryStatus, clearHistory }),
    [history, upsertEntry, updateEntryStatus, clearHistory]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}

export { HISTORY_STATUS };
