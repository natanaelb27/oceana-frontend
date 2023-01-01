import { CreateMarketplaceVoucherRequest } from '../../types/request';
import {
  CreateMarketplaceVoucherResponse,
  DeleteMarketplaceVoucherResponse,
  GetMarketplaceVoucherDetailsResponse,
  GetMarketplaceVoucherResponse,
  UpdateMarketplaceVoucherResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const marketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveMarketplaceVoucher: builder.query<
      GetMarketplaceVoucherResponse,
      void
    >({
      query: () => ({
        url: '/marketplace/vouchers/active',
        method: 'GET',
      }),
    }),
    getAllMarketplaceVoucher: builder.query<
      GetMarketplaceVoucherResponse,
      string
    >({
      query: (query) => ({
        url: `/marketplace/vouchers?${query}`,
        method: 'GET',
      }),
      providesTags: ['MarketplaceVoucher'],
    }),
    getMarketplaceVoucherByBuyer: builder.query<
      GetMarketplaceVoucherResponse,
      string
    >({
      query: (query) => ({
        url: `/marketplace/vouchers/buyer?${query}`,
        method: 'GET',
      }),
      providesTags: ['MarketplaceVoucher'],
    }),
    getMarketplaceVoucherDetails: builder.query<
      GetMarketplaceVoucherDetailsResponse,
      number
    >({
      query: (id) => ({
        url: `/marketplace/vouchers/${id}`,
        method: 'GET',
      }),
      providesTags: ['MarketplaceVoucher'],
    }),
    createMarketplaceVoucher: builder.mutation<
      CreateMarketplaceVoucherResponse,
      CreateMarketplaceVoucherRequest
    >({
      query: (request) => ({
        url: '/marketplace/vouchers',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['MarketplaceVoucher'],
    }),
    updateMarketplaceVoucher: builder.mutation<
      UpdateMarketplaceVoucherResponse,
      {
        id: number;
        request: CreateMarketplaceVoucherRequest;
      }
    >({
      query: ({ id, request }) => ({
        url: `/marketplace/vouchers/${id}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['MarketplaceVoucher'],
    }),
    deleteMarketplaceVoucher: builder.mutation<
      DeleteMarketplaceVoucherResponse,
      number
    >({
      query: (id) => ({
        url: `/marketplace/vouchers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MarketplaceVoucher'],
    }),
  }),
});

export const {
  useGetActiveMarketplaceVoucherQuery,
  useGetAllMarketplaceVoucherQuery,
  useLazyGetAllMarketplaceVoucherQuery,
  useGetMarketplaceVoucherByBuyerQuery,
  useLazyGetMarketplaceVoucherByBuyerQuery,
  useGetMarketplaceVoucherDetailsQuery,
  useLazyGetMarketplaceVoucherDetailsQuery,
  useCreateMarketplaceVoucherMutation,
  useUpdateMarketplaceVoucherMutation,
  useDeleteMarketplaceVoucherMutation,
} = marketplaceApi;
