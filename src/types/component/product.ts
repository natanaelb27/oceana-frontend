import { Courier } from './shipment';

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

export interface ProductModel {
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
  id: number;
  name: string;
  is_hazardous: boolean;
  weight: number;
  package_size: string;
  condition: string;
  status: string;
  category_id: number;
  category: string;
  images: string[];
  description: string;
  total_stock: number;
  like_count: number;
  total_purchased: number;
  product_review_details: ProductReviewDetails;
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

export interface ProductReviewDetails {
  rating_count: number;
  review_count: number;
  rating_star: number;
  satisfied_percentage: number;
  star_5: number;
  star_4: number;
  star_3: number;
  star_2: number;
  star_1: number;
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

export interface AvailableProduct {
  product_id: number;
  product_name: string;
  product_image: string;
  price_max: string;
  price_min: string;
  total_stock: string;
}

// ... product upsert model
export interface PUMVariant {
  name: string;
  options: string[];
  images: string[];
}

export interface PUMProductItem {
  id: number;
  sku: string;
  variant_index: number[];
  price: number;
  stock_quantity: number;
}

export interface PUMProduct {
  id: number;
  name: string;
  description: string;
  category_id: number;
  merchant_id: number;
  weight: number;
  is_hazardous: boolean;
  package_size: string;
  condition: string;
  status: string;
  process_day: number;
  images: string[];
  videos: string[];
  product_items: PUMProductItem[];
  variants: PUMVariant[];
  couriers: Courier[];
}
