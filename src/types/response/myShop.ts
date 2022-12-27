import { Metadata, ProductDetail } from '../component';

export type GetAllMyShopProductsResponse = {
  data: ProductDetail[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
