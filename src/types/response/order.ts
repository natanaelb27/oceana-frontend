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
    invoice_number: string;
    transaction_id: string;
    merchant_id: number;
    address_snapshot_id: number;
    courier_service_id: number;
    total_price: number;
    total_price_after_discount: number;
    shipping_fee: number;
    status: string;
    claim_status: boolean;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
