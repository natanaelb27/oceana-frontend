import {
  GetAllProductsResponse,
  GetProductDetailsResponse,
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
        url: `/products/${id}/favorite`,
        method: 'POST',
      }),
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
} = productApi;
