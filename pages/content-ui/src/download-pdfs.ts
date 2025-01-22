type Item = {
  url: string;
  filename: string;
};
export const downloadPdfs = async (data: Item[]) => {
  for (const item of data) {
    try {
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${item.url}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    } catch (error) {
      console.error(`Error downloading file from ${item.url}:`, error);
    }
  }
};
