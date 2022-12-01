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
  user: Profile;
  name: string;
  detail: string;
  sub_district_id: number;
  sub_district: SubDistrict;
  is_default: boolean;
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

interface ProductModel {
  product_item_id: number;
  sku: string;
  stock_quantity: number;
  price: number;
  price_after_discount: number | null;
  variation_index: number[];
}

interface ProductVariation {
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
