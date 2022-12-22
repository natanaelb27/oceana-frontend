import {
  AvailableProduct,
  FavoriteProduct,
  Metadata,
  Product,
  ProductDetail,
  PurchasedQuantities,
  ViewPost,
} from '../component';

export type GetAllProductsResponse = {
  data: Product[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetProductDetailsResponse = {
  data: ProductDetail | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetPurchasedQuantitiesResponse = {
  data: PurchasedQuantities | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type ViewPostResponse = {
  data: ViewPost | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type FavoriteProductResponse = {
  data: FavoriteProduct | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetFavoriteProductResponse = {
  data: FavoriteProduct | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAvailableProductResponse = {
  data: AvailableProduct[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
