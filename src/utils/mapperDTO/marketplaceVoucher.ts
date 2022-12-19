import { MarketplaceVoucherQuery } from '../../types/query';

export const toMarketplaceVoucherQuery = (query: MarketplaceVoucherQuery) => {
  let result = '';

  result += 'sort-by=' + query.sortBy;
  result += '&sort=' + query.sort;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-voucher-name=' + query.searchVoucherName;
  result += '&filter-voucher-status=' + query.filterVoucherStatus;

  return result;
};
