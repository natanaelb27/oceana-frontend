import { Metadata, Review } from '../component';

export type GetAllReviewsResponse = {
  data: Review[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
