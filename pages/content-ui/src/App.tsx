import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createUrlChangeListener } from './utils/create-url-change-listener';
import { getDownloadUrls } from './utils/get-download-urls';
import { downloadFile } from './utils/download-file';
import type { DownloadItem } from './types';

const ALLOWED_DOWNLOAD_PATHNAMES = ['/financials/invoices', '/proposals', '/contracts'];

export default function App() {
  const timeoutRef = useRef<number | null>(null);
  const pathnameRef = useRef<string>('');
  const isDownloadingRef = useRef(false); // for the url listener
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [downloaded, setDownloaded] = useState(-1);
  const [total, setTotal] = useState(0);
  const [failedItems, setFailedItems] = useState<DownloadItem[]>([]);

  useEffect(() => {
    createUrlChangeListener(({ pathname }) => {
      if (isDownloadingRef.current) return;
      pathnameRef.current = pathname;
    });
  }, []);

  useEffect(() => {
    const handleClickDocument = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (!ALLOWED_DOWNLOAD_PATHNAMES.includes(pathnameRef.current)) return;
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
    setDownloaded(0);
    isDownloadingRef.current = true;

    // get the urls
    const selectedItems = getDownloadUrls(pathnameRef.current);
    if (selectedItems.length) {
      setTotal(selectedItems.length);
      for (const item of selectedItems) {
        const result = await downloadFile(item);
        if (!result.success) {
          setFailedItems(prev => [...prev, result.item]);
        }
        setDownloaded(prev => prev + 1);
      }
    }

    setDownloaded(-1);
    isDownloadingRef.current = false;
    if (failedItems.length) {
      alert(`Failed to download the following items:\n${failedItems.map(item => item.title).join('\n')}`);
    }
  };

  if (!node) return null;

  const isDownloading = downloaded !== -1;

  // tailwindcss doesn't work with createPortal here
  return createPortal(
    <>
      {isDownloading ? (
        <progress max={total} value={downloaded} style={{ alignSelf: 'center' }} />
      ) : (
        <a onClick={handleClickDownload} className="option button isStripped" title="Download PDF/s">
          <div className="link-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="icon"
              width={14}
              height={14}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>
        </a>
      )}
    </>,
    node,
  );
}
