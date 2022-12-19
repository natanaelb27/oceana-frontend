export interface CheckoutCartProductItem {
  product_item_id: number;
  quantity: number;
  message: string;
}

export interface CheckoutCartProduct {
  product_id: number;
  product_merchant_promotion_id: number | null;
  product_items: CheckoutCartProductItem[];
}

export interface CheckoutCartOrderItem {
  merchant_id: number;
  merchant_voucher_id: number | null;
  courier_service_id: number;
  shipping_fee: number;
  products: CheckoutCartProduct[];
}
