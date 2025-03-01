import { type DownloadItem } from '@src/types';

const CONTAINER_SELECTORS = {
  '/financials/invoices': '.list-section.invoices-list',
  '/proposals': '.list-section.proposals-list',
  '/contracts': '.list-section.contracts-list',
} as const;

type AppPath = keyof typeof CONTAINER_SELECTORS;

// URL template configuration
const URL_TEMPLATES = {
  '/financials/invoices': (id: string) => `/invoice/${id}/download`,
  '/proposals': (id: string) => `/proposal/${id}/download`,
  '/contracts': (id: string) => `/contract/${id}/download`,
} satisfies Record<AppPath, (id: string) => string>;

export const getDownloadUrls = (pathname: string): DownloadItem[] => {
  const container = document.querySelector<HTMLElement>(CONTAINER_SELECTORS[pathname as AppPath] ?? '');
  if (!container) return [];

  return Array.from(container.querySelectorAll('.checkbox.isChecked'))
    .flatMap(checkbox => {
      const parent = checkbox.closest('._title._url');
      const link = parent?.querySelector<HTMLAnchorElement>('a._link');
      return link ? extractDownloadItem(link, pathname as AppPath) : null;
    })
    .filter((item): item is DownloadItem => item !== null);
};

const extractDownloadItem = (link: HTMLAnchorElement, pathname: AppPath): DownloadItem | null => {
  const parts = link.getAttribute('href')?.split('/');
  const id = pathname.startsWith('/financials/invoices') ? parts?.[3] : parts?.[2] || '';

  const title = link.textContent?.trim() || 'Untitled';
  const template = URL_TEMPLATES[pathname];

  return id
    ? {
        url: template(id),
        filename: `${title}_${id}.pdf`,
        title,
      }
    : null;
};
