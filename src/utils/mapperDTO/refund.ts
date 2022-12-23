import { RefundQuery } from '../../types/query';

export const toRefundQuery = (query: RefundQuery) => {
  let result = '';

  result += 'sort=' + query.sort;
  result += '&sort-by=' + query.sortBy;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-invoice=' + query.searchInvoice;
  result += '&filter-grouped-status=' + query.filterGroupedStatus;
  result += '&filter-status=' + query.filterStatus;
  result += '&filter-start-date=' + query.filterStartDate;
  result += '&filter-end-date=' + query.filterEndDate;
  return result;
};
