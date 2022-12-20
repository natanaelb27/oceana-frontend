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
