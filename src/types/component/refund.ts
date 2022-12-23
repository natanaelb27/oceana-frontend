export interface RefundItems {
  refund_detail_id: string;
  order_detail_id: string;
  product_image: string;
  product_name: string;
  product_variations: string;
  refund_quantity: number;
  user_refund_amount: number;
  merchant_lost_amount: number;
}

export interface RefundDetails {
  refund_id: string;
  order_id: string;
  invoice_number: string;
  merchant_id: number;
  shop_name: string;
  user_id: string;
  user_full_name: string;
  refund_request_datetime: string;
  rejected_datetime: string;
  refund_status: string;
  images: string[];
  videos: string[];
  refund_items: RefundItems[];
  total_user_refund_amount: number;
  total_merchant_lost_amount: number;
}
