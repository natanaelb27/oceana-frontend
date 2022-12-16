export type WalletPaymentResponse = {
  id: string;
  user_id: string;
  transaction_datetime: string;
  total_price: number;
  total_price_after_discount: number;
  total_price_with_shipping: number;
  payment_method_id: number;
  is_paid: boolean;
};
