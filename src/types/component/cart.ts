export interface CartProduct {
  carts_id: number;
  product_id: number;
  product_item_id: number;
  product_name: string;
  product_variation: string;
  quantity: number;
  stock_quantity: number;
  price: number;
  price_after_discount: number;
}
export interface CartGroupedByMerchant {
  merchant_id: number;
  merchant_province: string;
  name: string;
  products: CartProduct[];
}

export interface UpdateCart {
  id: number;
  product_item_id: number;
  user_id: string;
  quantity: number;
}
