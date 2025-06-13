export default function DownloadButton({ file }) {
  if (!file) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'compressed-image.jpg';
    link.click();
  };

  return (
    <button onClick={handleDownload}>Download Compressed Image</button>
  );
}
