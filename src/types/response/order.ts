import { Metadata, OrderList, OrderListDetail } from '../component';

export type GetAllTransactionHistoryResponse = {
  data: {
    order_list: OrderList[];
  } | null;
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
