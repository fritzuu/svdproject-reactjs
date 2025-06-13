import React from 'react';

export default function ImagePreview({ originals, compressed }) {
  return (
    <div className="preview-multi">
      {originals.map((original, index) => (
        <div className="preview-column" key={index}>
          <p>Original:</p>
          <img src={URL.createObjectURL(original)} alt={`Original ${index}`} />
          {compressed[index] && (
            <>
              <p style={{ marginTop: '1rem' }}>Compressed:</p>
              <img src={URL.createObjectURL(compressed[index])} alt={`Compressed ${index}`} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
