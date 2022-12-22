export interface CreateProductReview {
  id: number;
  user_id: string;
  order_detail_id: string;
  product_id: number;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
}
