export interface MarketplaceVoucher {
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
  voucher_status: string;
}
