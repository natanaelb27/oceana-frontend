import { Metadata, CreateProductReview } from '../component';

export type CreateProductReviewResponse = {
  data: CreateProductReview | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
