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
  order_details: OrderDetail[];
  transaction_datetime: string;
  order_status: string;
  total_price: number;
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
  order_details: OrderDetail[];
  transaction_datetime: string;
  order_status: string;
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
}
