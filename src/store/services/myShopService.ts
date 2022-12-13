import { CreateMerchantVoucherRequest } from '../../types/request';

import {
  CreateMerchantVoucherResponse,
  DeleteMerchantVoucherResponse,
  GetAllTransactionHistoryResponse,
  GetMerchantResponse,
  GetOrderDetailsResponse,
  UpdateMerchantVoucherResponse,
  UpdateOrderStatusResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const myShopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyShopProfile: builder.query<GetMerchantResponse, void>({
      query: () => ({
        url: '/my-shop/profile',
        method: 'GET',
      }),
      providesTags: ['MyShop'],
    }),
    createMerchantVoucher: builder.mutation<
      CreateMerchantVoucherResponse,
      CreateMerchantVoucherRequest
    >({
      query: (request) => ({
        url: '/my-shop/vouchers',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['MerchantVoucher'],
    }),
    updateMerchantVoucher: builder.mutation<
      UpdateMerchantVoucherResponse,
      {
        id: number;
        request: CreateMerchantVoucherRequest;
      }
    >({
      query: ({ id, request }) => ({
        url: `/my-shop/vouchers/${id}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['MerchantVoucher'],
    }),
    deleteMerchantVoucher: builder.mutation<
      DeleteMerchantVoucherResponse,
      number
    >({
      query: (id) => ({
        url: `/my-shop/vouchers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MerchantVoucher'],
    }),
    getAllMerchantTransactionHistory: builder.query<
      GetAllTransactionHistoryResponse,
      string
    >({
      query: (query) => ({
        url: `/my-shop/transaction-history?${query}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    getMerchantOrderDetails: builder.query<GetOrderDetailsResponse, string>({
      query: (id) => ({
        url: `/my-shop/transaction-history/${id}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetails'],
    }),
    updateProcessOrder: builder.mutation<UpdateOrderStatusResponse, string>({
      query: (id) => ({
        url: `/my-shop/orders/${id}/process-order`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order', 'OrderDetails'],
    }),
    updateProcessDelivery: builder.mutation<UpdateOrderStatusResponse, string>({
      query: (id) => ({
        url: `/my-shop/orders/${id}/process-delivery`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order', 'OrderDetails'],
    }),
  }),
});

export const {
  useGetMyShopProfileQuery,
  useLazyGetMyShopProfileQuery,
  useCreateMerchantVoucherMutation,
  useUpdateMerchantVoucherMutation,
  useDeleteMerchantVoucherMutation,
  useGetAllMerchantTransactionHistoryQuery,
  useLazyGetAllMerchantTransactionHistoryQuery,
  useGetMerchantOrderDetailsQuery,
  useLazyGetMerchantOrderDetailsQuery,
  useUpdateProcessOrderMutation,
  useUpdateProcessDeliveryMutation,
} = myShopApi;
