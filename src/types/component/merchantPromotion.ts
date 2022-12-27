export interface ProductMerchantPromotion {
  product_id: number;
  product_name: string;
  product_image: string;
  price_max: number;
  price_max_after_discount: number;
  price_min: number;
  price_min_after_discount: number;
  total_stock: number;
  discount_type: string;
  discount: number;
  maximum_discount_amount: number;
  maximum_quota: number;
  maximum_user_limit: number;
  current_quota: number;
}

export interface ProductMerchantPromotionOption {
  product_id: number;
  product_name: string;
  product_image: string;
  price_max: number;
  price_max_after_discount?: number;
  price_min: number;
  price_min_after_discount?: number;
  total_stock: number;
  discount_type?: string;
  discount?: number;
  maximum_discount_amount?: number;
  maximum_quota?: number;
  maximum_user_limit?: number;
  current_quota?: number;
}

export type SelectedProductMerchantPromotion = {
  [id: number]: ProductMerchantPromotionOption;
};

export interface MerchantPromotion {
  id: number;
  merchant_id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  promotion_status: string;
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
