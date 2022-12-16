export interface PayCartProductItem {
  product_item_id: number;
  quantity: number;
  message: string | null;
}

export interface PayCartProduct {
  product_id: number;
  product_merchant_promotion_id: number | null;
  product_items: PayCartProductItem[];
}

export interface PayCartOrderItem {
  merchant_id: number;
  merchant_voucher_id: number | null;
  courier_service_id: number;
  shipping_fee: number;
  products: PayCartProduct[];
}
