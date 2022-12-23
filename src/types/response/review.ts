import { Metadata, Review, CreateProductReview } from '../component';

export type GetAllReviewsResponse = {
  data: Review[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateProductReviewResponse = {
  data: CreateProductReview | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
