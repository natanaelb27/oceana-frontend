import { Metadata, ShopInformation } from '../component';

export type GetShopInformationResponse = {
  data: ShopInformation | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
