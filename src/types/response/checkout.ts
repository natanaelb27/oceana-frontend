import { Metadata } from '../component';

export type PaymentResponse = {
  data: {
    id: string;
    user_id: string;
    transaction_datetime: string;
    total_price: number;
    total_price_after_discount: number;
    total_price_with_shipping: number;
    payment_method_id: number;
    is_paid: boolean;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type ProductCheckCourierServiceResponse = {
  data: { available_products: number[] } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
