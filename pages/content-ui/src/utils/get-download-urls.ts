import { type DownloadItem } from '@src/types';

const FILE_TYPES = {
  invoices: {
    selector: '.list-section.invoices-list',
    getUrl: (id: string) => `/invoice/${id}/download`,
  },
  proposals: {
    selector: '.list-section.proposals-list',
    getUrl: (id: string) => `/proposal/${id}/download`,
  },
  contracts: {
    selector: '.list-section.contracts-list',
    getUrl: (id: string) => `/contract/${id}/download`,
  },
};

type FILE_TYPES_KEY = keyof typeof FILE_TYPES;

export const getDownloadUrls = (pathname: string): DownloadItem[] => {
  try {
    const fileType = getFileType(pathname);
    if (!fileType) return [];

    const container = document.querySelector<HTMLElement>(FILE_TYPES[fileType].selector);
    if (!container) return [];

    return Array.from(container.querySelectorAll('.checkbox.isChecked'))
      .flatMap(checkbox => {
        const parent = checkbox.closest('._title._url');
        const link = parent?.querySelector<HTMLAnchorElement>('a._link');
        return link ? extractDownloadItem(link, fileType) : null;
      })
      .filter((item): item is DownloadItem => item !== null);
  } catch (error) {
    return [];
  }
};

const getFileType = (pathname: string): FILE_TYPES_KEY | '' => {
  if (pathname.includes('invoices')) return 'invoices';
  if (pathname.includes('proposals')) return 'proposals';
  if (pathname.includes('contracts')) return 'contracts';
  return '';
};

const extractDownloadItem = (link: HTMLAnchorElement, fileType: FILE_TYPES_KEY): DownloadItem | null => {
  const parts = link.getAttribute('href')?.split('/');
  if (!parts) return null;

  const fileTypeIndex = parts.findIndex(part => part === fileType);
  if (fileTypeIndex === undefined || fileTypeIndex === -1) return null;

  const id = parts[fileTypeIndex + 1];
  const title = link.textContent?.trim() || 'Untitled';

  return id
    ? {
        url: FILE_TYPES[fileType].getUrl(id),
        filename: `${title}_${id}.pdf`,
        title,
      }
    : null;
};
