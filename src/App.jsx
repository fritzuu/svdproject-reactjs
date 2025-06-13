import { useEffect, useState } from 'react';
import DropzoneUploader from './components/DropzoneUploader';
import ImagePreview from './components/ImagePreview';
import CompressionOptions from './components/CompressionOptions';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import imageCompression from 'browser-image-compression';
import './styles/App.css';

export default function App() {
  const [originalImages, setOriginalImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [options, setOptions] = useState({ quality: 0.7, maxSize: 1024 });
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesSelected = (files) => {
    setOriginalImages(Array.from(files));
    setCompressedImages([]); // reset
  };

  useEffect(() => {
    const compressAllImages = async () => {
      if (originalImages.length === 0) return;
      setIsCompressing(true);
      try {
        const compressed = await Promise.all(
          originalImages.map((img) =>
            imageCompression(img, {
              maxSizeMB: 1,
              maxWidthOrHeight: options.maxSize,
              initialQuality: options.quality,
              useWebWorker: true,
            })
          )
        );
        setCompressedImages(compressed);
      } catch (err) {
        console.error(err);
      }
      setIsCompressing(false);
    };

    compressAllImages();
  }, [originalImages, options]);

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    compressedImages.forEach((file, index) => {
      zip.file(`compressed-${index + 1}.jpg`, file);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'compressed-images.zip');
  };

  const formatBytes = (bytes) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>🗜️ Compress IMAGE</h1>
        <p className="subtitle">Reduce the filesize of your images at once.</p>
        
        <div className="card">
          <DropzoneUploader onFilesSelected={handleFilesSelected} />
        </div>

        

        {originalImages.length > 0 && (
          <>
            <div className="card">
              <CompressionOptions options={options} setOptions={setOptions} />
            </div>

            {isCompressing && <p className="loading">⏳ Compressing images...</p>}

            <div className="card">
              <div className="preview-multi">
                {originalImages.map((orig, idx) => {
                  const compressed = compressedImages[idx];
                  return (
                    <div className="preview-column" key={idx}>
                      <p>Original</p>
                      <img src={URL.createObjectURL(orig)} alt="original" />
                      <p className="hint">Size: {formatBytes(orig.size)}</p>

                      {compressed && (
                        <>
                          <p>Compressed</p>
                          <img src={URL.createObjectURL(compressed)} alt="compressed" />
                          <p className="hint">Size: {formatBytes(compressed.size)}</p>
                          <button
                            onClick={() =>
                              saveAs(compressed, `compressed-${idx + 1}.jpg`)
                            }
                          >
                            Download
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card center">
              <button onClick={handleDownloadZip}>⬇️ Download All (ZIP)</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
