export interface Review {
  id: number;
  user_id: string;
  full_name: string;
  username: string;
  review_images: string[];
  review_videos: string[];
  photo: string | null;
  product_id: number;
  rating: number;
  review: string;
  product_review_media: string[] | null;
  product_variations: string;
  created_at: string;
}

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
