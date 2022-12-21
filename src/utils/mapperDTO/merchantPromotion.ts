import { MerchantPromotionQuery } from '../../types/query';
// import { MerchantPromotionRequest } from '../../types/request';

export const toMerchantPromotionQuery = (query: MerchantPromotionQuery) => {
  let result = '';

  result += 'limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-promotion-name=' + query.searchPromotionName;
  result +=
    '&filter-promotion-status=' + query.filterPromotionStatus.toLowerCase();

  return result;
};

// export const toCMerchantPromotionRequest = (
//   name: string,
//   startDateTime: Date,
//   endDateTime: Date,
//   discountType: string,
//   discount: number,
//   minimumSpendAmount: number,
//   maximumDiscountAmount: number | null,
//   maximumQuota: number
// ): MerchantPromotionRequest => ({
//   name,
//   start_datetime: startDateTime.toISOString(),
//   end_datetime: endDateTime.toISOString(),
//   discount_type: discountType,
//   discount,
//   minimum_spend_amount: minimumSpendAmount,
//   maximum_quota: maximumQuota,
//   maximum_discount_amount: maximumDiscountAmount,
// });
