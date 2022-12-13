export type CreateMerchantVoucherRequest = {
  code: string;
  start_datetime: string;
  end_datetime: string;
  discount_type: string;
  discount: number;
  minimum_spend_amount: number;
  maximum_discount_amount: number | null;
  maximum_quota: number;
};
