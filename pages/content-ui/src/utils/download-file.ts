import type { DownloadItem } from '@src/types';

export const downloadFile = async (item: DownloadItem) => {
  try {
    const response = await fetch(item.url);
    if (!response.ok) throw new Error(`HTTP ${response.status} on ${item.url}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Use requestAnimationFrame for smoother UI interaction
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = item.filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        requestAnimationFrame(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        });
      });
    });
  } catch (error) {
    console.error(`Failed ${item.filename}:`, error);
    return { success: false, item, error };
  }
  return { success: true, item };
};
