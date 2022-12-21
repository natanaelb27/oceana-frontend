import { MarketplaceVoucher, Metadata } from '../component';

export type GetMarketplaceVoucherResponse = {
  data: MarketplaceVoucher[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetMarketplaceVoucherDetailsResponse = {
  data: MarketplaceVoucher;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateMarketplaceVoucherResponse = {
  data: {
    id: number;
    name: string;
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

export type UpdateMarketplaceVoucherResponse = {
  data: {
    id: number;
    name: string;
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

export type DeleteMarketplaceVoucherResponse = {
  data: {
    id: number;
    name: string;
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
