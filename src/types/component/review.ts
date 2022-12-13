export interface Review {
    id: number;
    user_id: string;
    full_name: string;
    username: string;
    photo: string | null;
    product_id: number;
    rating: number;
    review: string;
    product_review_media: string[] | null;
    product_variations: string;
    created_at: string;
  }