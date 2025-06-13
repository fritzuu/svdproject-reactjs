export default function CompressionOptions({ options, setOptions }) {
  return (
    <div className="settings">
      <label>
        Quality: {Math.round(options.quality * 100)}%
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={options.quality}
          onChange={(e) => setOptions({ ...options, quality: parseFloat(e.target.value) })}
        />
      </label>

      <label>
        Max Size (px): {options.maxSize}
        <input
          type="range"
          min="100"
          max="3000"
          step="100"
          value={options.maxSize}
          onChange={(e) => setOptions({ ...options, maxSize: parseInt(e.target.value) })}
        />
      </label>
    </div>
  );
}
