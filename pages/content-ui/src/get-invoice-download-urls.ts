type ResultItem = {
  url: string;
  filename: string;
};

// TODO: search for card view. Only works on table view
export const getInvoiceDownloadUrls = () => {
  const res: ResultItem[] = [];
  const invoiceListContainer = document.querySelector('.list-section.invoices-list');
  if (!invoiceListContainer) return res;

  const checkedItems = invoiceListContainer.querySelectorAll('.checkbox.isChecked');

  checkedItems.forEach(item => {
    const parent = item.closest('._title._url');
    console.log('aaa parent', parent);
    if (parent) {
      const link = parent.querySelector('a._link');
      if (link) {
        // example href: /financials/invoices/akcjCHnP3j776wKLB/edit
        const parts = link.getAttribute('href')?.split('/');
        const id = parts?.[3] || '';
        const title = link.textContent || '';
        if (id && title) {
          res.push({
            url: `/invoice/${id}/download`,
            filename: `${title}-${id}.pdf`,
          });
        }
      }
    }
  });

  return res;
};
