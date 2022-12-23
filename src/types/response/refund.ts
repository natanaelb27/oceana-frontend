import { Metadata } from '../component';
import { RefundDetails, RefundOrder } from '../component/refund';

export type CreateRefundOrderResponse = {
  data: RefundOrder | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAllRefundDetailsResponse = {
  data: RefundDetails[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
