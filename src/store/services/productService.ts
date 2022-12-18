import { UpsertProductRequest } from '../../types/request/product';
import {
  FavoriteProductResponse,
  GetAllProductsResponse,
  GetFavoriteProductResponse,
  GetProductDetailsResponse,
  GetProductUpsertModelResponse,
  GetPurchasedQuantitiesResponse,
  ViewPostResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<GetAllProductsResponse, string>({
      query: (query) => ({
        url: `/products?${query}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getProductDetail: builder.query<GetProductDetailsResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getPurchasedQuantities: builder.query<
      GetPurchasedQuantitiesResponse,
      string
    >({
      query: (query) => ({
        url: `/products/purchased-quantities?${query}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    viewPost: builder.mutation<ViewPostResponse, string>({
      query: (id) => ({
        url: `/products/${id}/view`,
        method: 'POST',
      }),
    }),
    favoriteProduct: builder.mutation<FavoriteProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    getFavoriteProduct: builder.query<GetFavoriteProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}/favorite`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getProductUpsertModel: builder.query<GetProductUpsertModelResponse, void>({
      query: (id) => ({
        url: `/products/${id}/model`,
        method: 'GET',
      }),
      providesTags: ['ProductUpsertModel'],
    }),
    createProductUpsertModel: builder.mutation<
      GetProductUpsertModelResponse,
      { merchantID: number; request: UpsertProductRequest }
    >({
      query: ({ merchantID, request }) => ({
        url: `/my-shop/${merchantID}/products/`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['ProductUpsertModel'],
    }),
    updateProductUpsertModel: builder.mutation<
      GetProductUpsertModelResponse,
      { id: number; request: UpsertProductRequest }
    >({
      query: ({ id, request }) => ({
        url: `/my-shop/products/${id}`,
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['ProductUpsertModel'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useGetProductDetailQuery,
  useGetPurchasedQuantitiesQuery,
  useLazyGetProductDetailQuery,
  useLazyGetPurchasedQuantitiesQuery,
  useViewPostMutation,
  useFavoriteProductMutation,
  useGetFavoriteProductQuery,
  useLazyGetFavoriteProductQuery,
} = productApi;
