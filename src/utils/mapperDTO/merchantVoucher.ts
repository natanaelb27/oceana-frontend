import { MerchantVoucherQuery } from '../../types/query';
import { CreateMerchantVoucherRequest } from '../../types/request';

export const toMerchantVoucherQuery = (query: MerchantVoucherQuery) => {
  let result = '';

  result += 'sort-by=' + query.sortBy;
  result += '&sort=' + query.sort;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-voucher-code=' + query.searchVoucherCode;
  result += '&filter-voucher-status=' + query.filterVoucherStatus;
  result +=
    '&filter-voucher-availability=' +
    (!query.filterVoucherAvailability ? '' : query.filterVoucherAvailability);
  result += '&merchant-id=' + query.merchantID;

  return result;
};

export const toCreateMerchantVoucherRequest = (
  code: string,
  startDateTime: Date,
  endDateTime: Date,
  discountType: string,
  discount: number,
  minimumSpendAmount: number,
  maximumDiscountAmount: number | null,
  maximumQuota: number
): CreateMerchantVoucherRequest => ({
  code,
  start_datetime: startDateTime.toISOString(),
  end_datetime: endDateTime.toISOString(),
  discount_type: discountType,
  discount,
  minimum_spend_amount: minimumSpendAmount,
  maximum_quota: maximumQuota,
  maximum_discount_amount: maximumDiscountAmount,
});
