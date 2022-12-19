import {
  Metadata,
  OrderList,
  OrderListDetail,
  PendingPayment,
} from '../component';

export type GetAllTransactionHistoryResponse = {
  data: OrderList[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetOrderDetailsResponse = {
  data: OrderListDetail | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAllUserPendingPaymentResponse = {
  data: PendingPayment[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateOrderStatusResponse = {
  data: {
    id: string;
    status: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
