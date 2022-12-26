import {
  Metadata,
  CalculatedRefundDetails,
  RefundDetails,
  RefundOrder,
} from '../component';

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

export type GetRefundDetailsResponse = {
  data: RefundDetails | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetCalculatedRefundDetailsResponse = {
  data: CalculatedRefundDetails | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateRefundResponse = {
  data: {
    id: string;
    order_id: string;
    reason: string;
    refund_request_datetime: string;
    status: string;
    rejected_datetime: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
