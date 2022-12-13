import { CartGroupedByMerchant, Metadata, UpdateCart } from '../component';

export type GetUserCartResponse = {
  data: CartGroupedByMerchant[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateUserCartResponse = {
  data: UpdateCart | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
