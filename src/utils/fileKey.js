/** Stable key per original file within a session (dedup history). */
export function getFileKey(file) {
  return `${file.name}::${file.size}::${file.lastModified}`;
}
