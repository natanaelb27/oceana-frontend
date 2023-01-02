import {
  AvailableProduct,
  FavoriteProduct,
  Metadata,
  PUMProduct,
  Product,
  ProductDetail,
  PurchasedQuantities,
  ViewPost,
  ProductSnapshot,
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

export type GetProductUpsertModelResponse = {
  data: PUMProduct | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateProductResponse = GetProductUpsertModelResponse;

export type GetProductSnapshotResponse = {
  data: ProductSnapshot;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
