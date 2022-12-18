import {
  FavoriteProduct,
  Metadata,
  PUMProduct,
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

export type GetProductUpsertModelResponse = {
  data: PUMProduct | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
