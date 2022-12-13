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

export interface CityDetails {
  id: number;
  name: string;
  province_id: number;
  province: Province;
}

export interface DistrictDetails {
  id: number;
  name: string;
  city_id: number;
  city: CityDetails;
}

export interface SubDistrictDetails {
  id: number;
  name: string;
  district_id: number;
  district: DistrictDetails;
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
  media_url: string;
  is_hazardous: boolean;
  weight: number;
  package_size: string;
  condition: string;
  product_status: string;
  price_minimum: number;
  price_maximum: number;
  price_minimum_after_discount: number;
  price_maximum_after_discount: number;
  product_merchant_promotion_id: number;
  merchant_promotion_name: string;
  discount: number;
  discount_type: string;
  total_view_count: number;
  total_purchase_count: number;
  rating_star: number;
  merchant: {
    id: number;
    name: string;
    city: string;
  };
  updated_at: string;
  created_at: string;
}

interface ProductModel {
  product_item_id: number;
  sku: string;
  stock_quantity: number;
  price: number;
  price_after_discount: number | null;
  product_variations: string;
  variation_index: number[];
}

export interface ProductVariation {
  name: string;
  options: string[];
  image: string[];
  summed_stocks: number[];
}

export interface ProductDetail {
  name: string;
  is_hazardous: boolean;
  weight: number;
  package_size: string;
  condition: string;
  category_id: number;
  category: string;
  images: string[];
  description: string;
  total_stock: number;
  like_count: number;
  rating_count: number;
  rating_star: number;
  discount_type: string | null;
  discount: number | null;
  price: number;
  price_after_discount: number | null;
  price_max: number;
  price_max_after_discount: number | null;
  price_min: number;
  price_min_after_discount: number | null;
  product_model: ProductModel[];
  product_variation: ProductVariation[];
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

export interface UpdateCart {
  id: number;
  product_item_id: number;
  user_id: string;
  quantity: number;
}
export interface OrderDetail {
  order_detail_id: string;
  message: string;
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

export interface CategoryDetails {
  id: number;
  media_url: string;
  name: string;
  parent_id: number;
}

export interface City {
  id: number;
  name: string;
}

export interface PurchasedQuantities {
  price: number;
  stock: number;
  max_purchase_quantity: number;
  user_max_purchase_quantity: number;
  product_merchant_promotion_id: number;
}

export interface ShopInformation {
  id: number;
  name: string;
  photo: string;
  total_rating: number;
  rating_star: number;
  product_count: number;
  user_id: string;
  shop_address: string;
  shop_sub_district: string;
  shop_district: string;
  shop_city: string;
  shop_province: string;
}

export interface ViewPost {
  user_id: string;
  product_id: number;
  last_viewed_at: string;
  count: number;
}

export interface FavoriteProduct {
  user_id: string;
  product_id: number;
  is_favorite: boolean;
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
