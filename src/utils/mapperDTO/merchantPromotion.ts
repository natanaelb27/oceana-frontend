import { SelectedProductMerchantPromotion } from '../../types/component';
import { MerchantPromotionQuery } from '../../types/query';
import {
  MerchantPromotionRequest,
  ProductMerchantPromotionRequest,
} from '../../types/request';

export const toMerchantPromotionQuery = (query: MerchantPromotionQuery) => {
  let result = '';

  result += 'limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-promotion-name=' + query.searchPromotionName;
  result +=
    '&filter-promotion-status=' + query.filterPromotionStatus.toLowerCase();

  return result;
};

export const toProductMerchantPromotionsRequest = (
  products: SelectedProductMerchantPromotion
): ProductMerchantPromotionRequest[] => {
  const request = Object.entries(products).map(
    ([
      ,
      {
        product_id,
        discount_type,
        discount,
        maximum_discount_amount,
        maximum_quota,
        maximum_user_limit,
      },
    ]) => ({
      product_id: product_id,
      discount_type: String(discount_type).toLowerCase(),
      discount: Number(discount),
      maximum_discount_amount: Number(maximum_discount_amount),
      maximum_quota: Number(maximum_quota),
      maximum_user_limit: Number(maximum_user_limit),
    })
  );

  return request;
};

export const toMerchantPromotionRequest = (
  name: string,
  startDateTime: Date,
  endDateTime: Date,
  products: SelectedProductMerchantPromotion
): MerchantPromotionRequest => ({
  name,
  start_datetime: startDateTime.toISOString(),
  end_datetime: endDateTime.toISOString(),
  product_id_list: Object.entries(products).map(
    ([, { product_id }]) => product_id
  ),
  product_merchant_promotion: toProductMerchantPromotionsRequest(products),
});
