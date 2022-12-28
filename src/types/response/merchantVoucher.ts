import { MerchantVoucher, Metadata } from '../component';

export type GetMerchantVoucherResponse = {
  data: {
    merchant_voucher: MerchantVoucher[];
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetMerchantVoucherDetailsResponse = {
  data: MerchantVoucher;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateMerchantVoucherResponse = {
  data: {
    id: number;
    merchant_id: number;
    code: string;
    start_datetime: string;
    end_datetime: string;
    discount_type: string;
    discount: number;
    minimum_spend_amount: number;
    maximum_discount_amount: number;
    maximum_quota: number;
    current_quota: number;
    created_at: string;
    updated_at: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateMerchantVoucherResponse = {
  data: {
    id: number;
    merchant_id: number;
    code: string;
    start_datetime: string;
    end_datetime: string;
    discount_type: string;
    discount: number;
    minimum_spend_amount: number;
    maximum_discount_amount: number;
    maximum_quota: number;
    current_quota: number;
    created_at: string;
    updated_at: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type DeleteMerchantVoucherResponse = {
  data: {
    id: number;
    merchant_id: number;
    code: string;
    start_datetime: string;
    end_datetime: string;
    discount_type: string;
    discount: number;
    minimum_spend_amount: number;
    maximum_discount_amount: number;
    maximum_quota: number;
    current_quota: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
