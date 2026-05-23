import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadAsZip(files, zipName = "compressed-images.zip") {
  const zip = new JSZip();
  files.forEach((file, index) => {
    zip.file(file.name || `compressed-${index + 1}`, file);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipName);
}
