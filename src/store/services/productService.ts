import {
  GetAllProductsResponse,
  GetProductDetailsResponse,
  GetPurchasedQuantitiesResponse,
  GetShipmentResponse,
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
    getProductsLogistics: builder.query<GetShipmentResponse, number>({
      query: (merchantID) => ({
        url: `/products/logistics/${merchantID}`,
        method: 'GET',
      }),
      providesTags: ['Shipment'],
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
  useLazyGetProductsLogisticsQuery,
} = productApi;
