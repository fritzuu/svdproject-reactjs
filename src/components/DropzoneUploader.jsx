import React, { useRef } from 'react';
import '../styles/App.css';

export default function DropzoneUploader({ onFilesSelected }) {
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="dropzone"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={openFileDialog}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <p>📂 Drag & drop images here, or click to select</p>
    </div>
  );
}
