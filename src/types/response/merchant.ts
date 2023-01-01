import { Merchant, Metadata } from '../component';

export type GetMerchantResponse = {
  data: Merchant;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateMerchantResponse = {
  data: Merchant | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateMerchantResponse = {
  data: Merchant | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type MerchantGetInformationByIDResponse = {
  data: {
    id: number;
    name: string;
    photo: string;
    total_rating: number;
    rating_star: number;
    product_count: number;
    user_id: string;
    shop_address: string;
    shop_sub_district: string;
    shop_district: string;
    shop_city: string;
    shop_province: string;
    joined_date: string;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
