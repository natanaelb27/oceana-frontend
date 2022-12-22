import { MerchantPromotion, Metadata } from '../component';

export type MerchantPromotionResponse = {
  data: MerchantPromotion[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type MerchantPromotionDetailsResponse = {
  data: MerchantPromotion | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
