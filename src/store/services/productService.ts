import {
  ProductCheckCourierServiceRequest,
  UpsertProductRequest,
} from '../../types/request';
import {
  GetAllProductsResponse,
  GetAvailableProductResponse,
  GetProductDetailsResponse,
  GetProductUpsertModelResponse,
  GetPurchasedQuantitiesResponse,
  GetShipmentResponse,
  FavoriteProductResponse,
  GetFavoriteProductResponse,
  ViewPostResponse,
  ProductCheckCourierServiceResponse,
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
    getAvailableProducts: builder.query<GetAvailableProductResponse, string>({
      query: (query) => ({
        url: `/products/available-products?${query}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getProductsLogistics: builder.query<GetShipmentResponse, number>({
      query: (merchantID) => ({
        url: `/products/logistics/${merchantID}`,
        method: 'GET',
      }),
      providesTags: ['Shipment'],
    }),
    checkProductCourierServices: builder.mutation<
      ProductCheckCourierServiceResponse,
      ProductCheckCourierServiceRequest
    >({
      query: (request) => ({
        url: '/products/check-courier-service',
        method: 'POST',
        body: request,
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
    getProductUpsertModel: builder.query<GetProductUpsertModelResponse, string>(
      {
        query: (id) => ({
          url: `/products/${id}/model`,
          method: 'GET',
        }),
        providesTags: ['ProductUpsertModel'],
      }
    ),
    createProductUpsertModel: builder.mutation<
      GetProductUpsertModelResponse,
      { request: UpsertProductRequest }
    >({
      query: ({ request }) => ({
        url: '/my-shop/products',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Product', 'MyShopProduct'],
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
      invalidatesTags: ['Product', 'MyShopProduct'],
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
  useGetAvailableProductsQuery,
  useLazyGetAvailableProductsQuery,
  useLazyGetProductsLogisticsQuery,
  useCheckProductCourierServicesMutation,
  useFavoriteProductMutation,
  useGetFavoriteProductQuery,
  useLazyGetFavoriteProductQuery,
  useLazyGetProductUpsertModelQuery,
  useCreateProductUpsertModelMutation,
  useUpdateProductUpsertModelMutation,
} = productApi;
