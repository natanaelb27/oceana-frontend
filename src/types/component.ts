export interface Metadata {
  records_total: number;
  records_filter: number;
  page: number;
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
  total_view_count: number;
  merchant: {
    id: number;
    name: string;
    city: string;
  };
  updated_at: string;
  created_at: string;
}
