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
      }
    : null;
};

// export const getDownloadUrls2 = (pathname: string) => {
//   const res: DownloadItem[] = [];

//   const listContainer = getListContainer(pathname);
//   if (!listContainer) return res;

//   const checkedItems = listContainer.querySelectorAll('.checkbox.isChecked');

//   checkedItems.forEach(item => {
//     const parent = item.closest('._title._url');
//     if (parent) {
//       const link = parent.querySelector('a._link');
//       if (link) {
//         const item = extractDownloadItem(link, pathname);
//         if (item) {
//           res.push(item);
//         }
//       }
//     }
//   });

//   return res;
// };

// const getListContainer = (pathname: string) => {
//   if (pathname === '/financials/invoices') {
//     return document.querySelector('.list-section.invoices-list');
//   } else if (pathname === '/proposals') {
//     return document.querySelector('.list-section.proposals-list');
//   } else if (pathname === '/contracts') {
//     return document.querySelector('.list-section.contracts-list');
//   } else {
//     return null;
//   }
// };

// // hrefs: /financials/invoices/akcjCHnP3j776wKLB/edit -- invoice
// // /proposals/akcjCHnP3j776wKLB/edit -- proposal
// // /contracts/akcjCHnP3j776wKLB/edit -- contract
// const extractDownloadItem2 = (link: Element, pathname: string) => {
//   const parts = link.getAttribute('href')?.split('/');
//   const id = pathname.startsWith('/financials/invoices') ? parts?.[3] : parts?.[2] || '';
//   const title = link.textContent || '';

//   if (id && title) {
//     return {
//       url: pathname.startsWith('/financials/invoices')
//         ? `/invoice/${id}/download`
//         : pathname.startsWith('/proposals')
//           ? `/proposal/${id}/download`
//           : `/contract/${id}/download`,
//       filename: `${title}-${id}.pdf`,
//     };
//   }

//   return null;
// };
