import { useEffect, useState } from 'react';
import DropzoneUploader from './components/DropzoneUploader';
import ImagePreview from './components/ImagePreview';
import CompressionOptions from './components/CompressionOptions';
import DownloadButton from './components/DownloadButton';
import imageCompression from 'browser-image-compression';
import './styles/App.css';

export default function App() {
  const [originalImages, setOriginalImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [options, setOptions] = useState({ quality: 0.7, maxSize: 1024 });
  const [isCompressing, setIsCompressing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const userPref = localStorage.getItem('darkMode');
    if (userPref === null) {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setDarkMode(userPref === 'true');
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleFilesSelected = (files) => {
    const newFiles = Array.from(files);
    setOriginalImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    const newOriginals = [...originalImages];
    const newCompressed = [...compressedImages];
    newOriginals.splice(index, 1);
    newCompressed.splice(index, 1);
    setOriginalImages(newOriginals);
    setCompressedImages(newCompressed);
  };

  useEffect(() => {
    const compressAll = async () => {
      if (originalImages.length === 0) return;
      setIsCompressing(true);
      const compressedList = [];

      for (let img of originalImages) {
        try {
          const compressed = await imageCompression(img, {
            maxSizeMB: 1,
            maxWidthOrHeight: options.maxSize,
            initialQuality: options.quality,
            useWebWorker: true,
          });
          compressedList.push(compressed);
        } catch (err) {
          console.error(err);
          compressedList.push(null);
        }
      }

      setCompressedImages(compressedList);
      setIsCompressing(false);
    };

    compressAll();
  }, [originalImages, options]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>🗜️ Compress IMAGE</h1>
        <p className="subtitle">Reduce the filesize of your images at once.</p>

        <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <div className="card">
          <DropzoneUploader onFilesSelected={handleFilesSelected} />
        </div>

        {originalImages.length > 0 && (
          <>
            <div className="card">
              <CompressionOptions options={options} setOptions={setOptions} />
            </div>

            {isCompressing && <p className="loading">⏳ Compressing image...</p>}

            <div className="card">
              <div className="preview-multi">
                {originalImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="preview-column"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', idx);
                    }}
                    onDragEnd={(e) => {
                      const dropY = e.clientY;
                      if (dropY < 0 || dropY > window.innerHeight) {
                        handleRemoveImage(idx);
                      }
                    }}
                  >
                    <p>{img.name}</p>
                    <img src={URL.createObjectURL(img)} alt="original" />
                    {compressedImages[idx] && (
                      <>
                        <p>
                          Estimasi: {Math.round(img.size / 1024)}KB →{' '}
                          {Math.round(compressedImages[idx].size / 1024)}KB
                        </p>
                        <DownloadButton file={compressedImages[idx]} name={img.name} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
