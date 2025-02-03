type Item = {
  url: string;
  filename: string;
};

export const downloadPdfs = async (data: Item[]) => {
  const MAX_CONCURRENT_DOWNLOADS = 5; // Optimized for browser connection limits
  const downloadFile = async (item: Item) => {
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

  // Batch processing with concurrency control
  const chunks = [];
  for (let i = 0; i < data.length; i += MAX_CONCURRENT_DOWNLOADS) {
    const chunk = data.slice(i, i + MAX_CONCURRENT_DOWNLOADS);
    chunks.push(Promise.allSettled(chunk.map(downloadFile)));
  }

  // Process chunks sequentially but items in parallel within chunks
  const results = [];
  for (const chunk of chunks) {
    results.push(...(await chunk));
  }

  return results;
};
