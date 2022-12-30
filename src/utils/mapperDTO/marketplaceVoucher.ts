import { MarketplaceVoucherQuery } from '../../types/query';
import { CreateMarketplaceVoucherRequest } from '../../types/request';

export const toMarketplaceVoucherQuery = (query: MarketplaceVoucherQuery) => {
  let result = '';

  result += 'sort-by=' + query.sortBy;
  result += '&sort=' + query.sort;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-voucher-name=' + query.searchVoucherName;
  result += '&filter-voucher-status=' + query.filterVoucherStatus;
  result += '&filter-voucher-availability=' + query.filterVoucherAvailability;

  return result;
};

export const toCreateMarketplaceVoucherRequest = (
  name: string,
  startDateTime: Date,
  endDateTime: Date,
  discountType: string,
  discount: number,
  minimumSpendAmount: number,
  maximumDiscountAmount: number | null,
  maximumQuota: number
): CreateMarketplaceVoucherRequest => ({
  name,
  start_datetime: startDateTime.toISOString(),
  end_datetime: endDateTime.toISOString(),
  discount_type: discountType,
  discount,
  minimum_spend_amount: minimumSpendAmount,
  maximum_quota: maximumQuota,
  maximum_discount_amount: maximumDiscountAmount,
});
