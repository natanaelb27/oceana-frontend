export interface Metadata {
  limit: number;
  page: number;
  total_pages: number;
  total_rows: number;
}

export interface User {
  id: string;
  name: string;
}

export interface Role {
  role: string;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  gender?: string;
  photo?: string;
  birthdate?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  image: string;
  name: string;
  level: number;
  category: Category[];
}

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province_id: number;
  province: Province;
}

export interface District {
  id: number;
  name: string;
  city_id: number;
  city: City;
}

export interface SubDistrict {
  id: number;
  name: string;
  district_id: number;
  district: District;
  zip_code: string;
}

export interface Address {
  id: string;
  user_id: string;
  phone_number: string;
  name: string;
  detail: string;
  sub_district_id: number;
  sub_district: string;
  zip_code: string;
  district_id: number;
  district: string;
  city_id: number;
  city: string;
  province_id: number;
  province: string;
  is_default: boolean;
  is_shop_address: boolean;
}
export interface Category {
  id: number;
  name: string;
  level: number;
  category: Category[];
}

export interface Product {
  id: number;
  merchant_id: number;
  category_id: number;
  name: string;
  description: string;
  is_hazardous: boolean;
  weight: number;
  package_size: string;
  condition: string;
  product_status: string;
  price_minimum: number;
  price_maximum: number;
  price_minimum_after_discount: number;
  price_maximum_after_discount: number;
  discount: number;
  discount_type: string;
  total_view_count: number;
  merchant: {
    id: number;
    name: string;
    city: string;
  };
  updated_at: string;
  created_at: string;
}

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
export interface Merchant {
  id: number;
  user_id: string;
  name: string;
  address_id: string;
  photo: string;
}

export interface SealabsPayTransaction {
  txn_id: string;
  amount: string;
  merchant_code: string;
  status: string;
  message: string;
  signature: string;
}
export interface MerchantVoucher {
  id: number;
  merchant_id: number;
  code: string;
  start_datetime: string;
  end_datetime: string;
  discount_type: string;
  discount: number;
  minimum_spend_amount: number;
  maximum_discount_amount: number;
  maximum_quota: number;
  current_quota: number;
  voucher_status: string;
}
