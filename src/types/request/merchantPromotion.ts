export type ProductMerchantPromotionRequest = {
  product_id: number;
  discount_type: string;
  discount: number;
  maximum_discount_amount: number;
  maximum_quota: number;
  maximum_user_limit: number;
};

export type MerchantPromotionRequest = {
  name: string;
  start_datetime: string;
  end_datetime: string;
  product_id_list: number[];
  product_merchant_promotion: ProductMerchantPromotionRequest[];
};
