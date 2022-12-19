export interface OrderDetail {
  order_detail_id: string;
  product_image: string | null;
  product_name: string;
  product_variations: string;
  quantity: number;
  price: number;
  total_price: number;
}
export interface OrderList {
  transaction_id: string;
  order_id: string;
  invoice_number: string;
  merchant_id: number;
  shop_name: string;
  user_id: string;
  user_full_name: string;
  courier_service_id: number;
  courier_description: string;
  order_details: OrderDetail[];
  transaction_datetime: string;
  order_status: string;
  total_price: number;
  refund_id: string | null;
  claim_status: boolean;
  seller_confirmation_expiration_datetime: string | null;
  on_process_expiration_datetime: string | null;
  delivered_expiration_datetime: string | null;
}

export interface OrderTracking {
  datetime: string;
  title: string;
  description: string;
}

export interface OrderListDetail {
  transaction_id: string;
  order_id: string;
  invoice_number: string;
  merchant_id: number;
  shop_name: string;
  user_id: string;
  user_full_name: string;
  order_details: OrderDetail[];
  transaction_datetime: string;
  order_status: string;
  courier_service_id: number;
  courier_description: string;
  order_tracking_history: OrderTracking[];
  address: {
    detail: string;
    sub_district: string;
    zip_code: string;
    district: string;
    city: string;
    province: string;
  };
  payment_method: string;
  total_price_before_discount: number;
  total_merchant_promotion_discount: number;
  total_merchant_voucher_discount: number;
  total_marketplace_voucher_discount: number;
  shipping_fee: number;
  total_payment: number;
  refund_id: string | null;
  claim_status: boolean;
  seller_confirmation_expiration_datetime: string | null;
  on_process_expiration_datetime: string | null;
  delivered_expiration_datetime: string | null;
}

export interface PendingPayment {
  transaction_id: string;
  user_id: string;
  user_full_name: string;
  transaction_datetime: string;
  payment_method_id: number;
  payment_method_name: string;
  payment_method_image: string;
  payment_expiration_datetime: string;
  card_number: string;
  total_payment: number;
}
