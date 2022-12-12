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

export interface PurchasedQuantities {
  price: number;
  stock: number;
  max_purchase_quantity: number;
  user_max_purchase_quantity: number;
  product_merchant_promotion_id: number;
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
