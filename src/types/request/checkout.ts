import { CheckoutCartOrderItem } from '../component/checkout';

export type PayCartWithWalletRequest = {
  cart_order_items: CheckoutCartOrderItem[];
  cart_ids: number[];
  marketplace_voucher_id: number | null;
  address_id: string;
  pin: string;
  total_payment: number;
};
