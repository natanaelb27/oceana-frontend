import { RefundDetails, Metadata } from '../component';

export type GetAllRefundDetailsResponse = {
  data: RefundDetails[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetRefundDetailsResponse = {
  data: RefundDetails | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
