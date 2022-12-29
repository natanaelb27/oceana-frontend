import { CheckoutCartOrderItem } from '../component/checkout';

export type PayCartWithWalletRequest = {
  cart_order_items: CheckoutCartOrderItem[];
  cart_ids: number[];
  marketplace_voucher_id: number | null;
  address_id: string;
  pin: string;
  total_payment: number;
};

export type PayCartWithSealabsPayRequest = {
  cart_order_items: CheckoutCartOrderItem[];
  cart_ids: number[];
  marketplace_voucher_id: number | null;
  address_id: string;
  card_number: string;
  total_payment: number;
};

export type PayCartWithSealabsPaySuccessRequest = {
  transaction_id: string;
  txn_id: string;
  card_number: string;
  signature: string;
};

export type ProductCheckCourierServiceRequest = {
  courier_code: string;
  courier_service_code: string;
  product_ids: number[];
};
