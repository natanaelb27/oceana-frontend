export interface ProductMerchantPromotion {
  id: number;
  merchant_promotion_model_id: number;
  product_id: number;
  discount_type: string;
  discount: number;
  maximum_discount_amount: number;
  maximum_quota: number;
  maximum_user_limit: number;
  current_quota: number;
  created_at: string;
  updated_at: string;
}

export interface MerchantPromotion {
  id: number;
  merchant_id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  created_at: string;
  updated_at: string;
  product_merchant_promotion: ProductMerchantPromotion[];
}

export interface MerchantPromotionDetails {
  id: number;
  merchant_id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  promotion_status: string;
  product_merchant_promotion: ProductMerchantPromotion[];
}
