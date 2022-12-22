export interface Merchant {
  id: number;
  user_id: string;
  name: string;
  address_id: string;
  photo: string;
}

export interface MerchantDetail {
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
