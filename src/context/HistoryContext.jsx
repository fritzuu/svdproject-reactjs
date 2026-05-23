import { createContext, useCallback, useContext, useState } from "react";

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

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(loadHistory);

  const persist = useCallback((items) => {
    const stored = items.map(stripThumbnail).slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setHistory(items.slice(0, MAX_ITEMS));
  }, []);

  const addEntry = useCallback(
    (entry) => {
      const id = crypto.randomUUID();
      const newEntry = { ...entry, id, timestamp: Date.now() };
      persist([newEntry, ...history]);
      return id;
    },
    [history, persist]
  );

  const clearHistory = useCallback(() => persist([]), [persist]);

  return (
    <HistoryContext.Provider value={{ history, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
