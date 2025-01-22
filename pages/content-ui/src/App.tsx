import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { downloadPdfs } from './download-pdfs';
import { getInvoiceDownloadUrls } from './get-invoice-download-urls';

export default function App() {
  const timeoutRef = useRef<number | null>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [isDownloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleClickDocument = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const node = document.querySelector('.page-footer .bulk-toolbar-section._options');
        setNode(node as HTMLElement);
      }, 500); // Debounce for 500ms
    };

    document.addEventListener('mouseup', handleClickDocument);

    return () => {
      document.removeEventListener('mouseup', handleClickDocument);
    };
  }, []);

  const handleClickDownload = async () => {
    setDownloading(true);

    // get the urls
    const selectedInvoices = getInvoiceDownloadUrls();
    if (selectedInvoices.length) {
      await downloadPdfs(selectedInvoices);
    }

    setDownloading(false);
  };

  if (!node) return null;

  // tailwindcss doesn't work with createPortal here
  return createPortal(
    <button
      onClick={handleClickDownload}
      className="option button isStripped"
      disabled={isDownloading}
      title="Download PDF/s">
      {isDownloading ? (
        'Downloading...'
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
          width={16}
          height={16}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      )}
    </button>,
    node,
  );
}
