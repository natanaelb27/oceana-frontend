export interface CartProduct {
  carts_id: number;
  product_id: number;
  product_item_id: number;
  product_merchant_promotion_id: number;
  product_name: string;
  product_variation: string;
  product_weight: number;
  product_media_url: string;
  quantity: number;
  stock_quantity: number;
  price: number;
  price_after_discount: number;
}
export interface CartGroupedByMerchant {
  merchant_id: number;
  merchant_province: string;
  city_id: number;
  name: string;
  products: CartProduct[];
}

export interface UpdateCart {
  id: number;
  product_item_id: number;
  user_id: string;
  quantity: number;
}
