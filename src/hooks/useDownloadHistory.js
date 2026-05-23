import { useCallback } from "react";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { useHistory, HISTORY_STATUS } from "../context/HistoryContext";
import { downloadAsZip } from "../services/zipService";

function buildEntryPayload(meta, compressed, thumbnail) {
  return {
    fileKey: meta.fileKey,
    fileName: compressed.name,
    originalSize: meta.originalSize,
    compressedSize: meta.compressedSize,
    savedPercent: meta.savedPercent,
    thumbnail,
    status: HISTORY_STATUS.PROCESSING,
  };
}

export function useDownloadHistory() {
  const { upsertEntry, updateEntryStatus } = useHistory();

  const recordDownload = useCallback(
    async (meta, compressed, downloadFn) => {
      if (!meta?.fileKey || !compressed) return false;

      upsertEntry(buildEntryPayload(meta, compressed, meta.thumbnail));

      try {
        await downloadFn();
        updateEntryStatus(meta.fileKey, HISTORY_STATUS.DOWNLOADED, {
          fileName: compressed.name,
          compressedSize: compressed.size,
          savedPercent: meta.savedPercent,
        });
        return true;
      } catch (err) {
        console.error(err);
        updateEntryStatus(meta.fileKey, HISTORY_STATUS.FAILED);
        return false;
      }
    },
    [upsertEntry, updateEntryStatus]
  );

  const downloadSingle = useCallback(
    async (meta, compressed) => {
      const ok = await recordDownload(meta, compressed, async () => {
        saveAs(compressed, compressed.name);
      });
      if (ok) toast.success("Image downloaded");
      else toast.error("Download failed");
    },
    [recordDownload]
  );

  const downloadAllZip = useCallback(
    async (items) => {
      const valid = items.filter((x) => x.meta && x.compressed);
      if (!valid.length) return;

      for (const { meta, compressed } of valid) {
        upsertEntry(buildEntryPayload(meta, compressed, meta.thumbnail));
      }

      try {
        await downloadAsZip(valid.map((x) => x.compressed));
        for (const { meta, compressed } of valid) {
          updateEntryStatus(meta.fileKey, HISTORY_STATUS.DOWNLOADED, {
            fileName: compressed.name,
            compressedSize: compressed.size,
            savedPercent: meta.savedPercent,
          });
        }
        toast.success("ZIP downloaded!");
      } catch (err) {
        console.error(err);
        for (const { meta } of valid) {
          updateEntryStatus(meta.fileKey, HISTORY_STATUS.FAILED);
        }
        toast.error("Download failed");
      }
    },
    [upsertEntry, updateEntryStatus]
  );

  return { downloadSingle, downloadAllZip };
}
