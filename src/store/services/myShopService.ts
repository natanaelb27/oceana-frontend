import {
  CreateMerchantVoucherRequest,
  MerchantPromotionRequest,
} from '../../types/request';

import {
  CreateMerchantVoucherResponse,
  DeleteMerchantVoucherResponse,
  GetAllTransactionHistoryResponse,
  GetMerchantResponse,
  GetOrderDetailsResponse,
  UpdateMerchantResponse,
  UpdateMerchantVoucherResponse,
  UpdateOrderStatusResponse,
} from '../../types/response';
import {
  MerchantPromotionDetailsResponse,
  MerchantPromotionResponse,
} from '../../types/response/merchantPromotion';
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
    updateMyShopPhoto: builder.mutation<UpdateMerchantResponse, FormData>({
      query: (request) => ({
        url: '/my-shop/profile/photo',
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['MyShop', 'Merchant'],
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
    sellerCancelOrder: builder.mutation<UpdateOrderStatusResponse, string>({
      query: (id) => ({
        url: `/my-shop/orders/${id}/cancel-order`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order', 'OrderDetails'],
    }),
    getMerchantPromotion: builder.query<MerchantPromotionResponse, string>({
      query: (query) => ({
        url: `/my-shop/promotions?${query}`,
        method: 'GET',
      }),
      providesTags: ['MerchantPromotion'],
    }),
    getMerchantPromotionDetails: builder.query<
      MerchantPromotionDetailsResponse,
      number
    >({
      query: (id) => ({
        url: `/my-shop/promotions/${id}`,
        method: 'GET',
      }),
      providesTags: ['MerchantPromotion'],
    }),
    createMerchantPromotion: builder.mutation<
      MerchantPromotionDetailsResponse,
      MerchantPromotionRequest
    >({
      query: (request) => ({
        url: '/my-shop/promotions',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['MerchantPromotion'],
    }),
    updateMerchantPromotion: builder.mutation<
      MerchantPromotionDetailsResponse,
      { id: number; request: MerchantPromotionRequest }
    >({
      query: ({ id, request }) => ({
        url: `/my-shop/promotions/${id}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['MerchantPromotion'],
    }),
    deleteMerchantPromotion: builder.mutation<
      MerchantPromotionDetailsResponse,
      number
    >({
      query: (id) => ({
        url: `/my-shop/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MerchantPromotion'],
    }),
    sellerClaimFunds: builder.mutation<UpdateOrderStatusResponse, string>({
      query: (id) => ({
        url: `/my-shop/orders/${id}/claim-funds`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order', 'OrderDetails', 'Profile'],
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
  useSellerCancelOrderMutation,
  useGetMerchantPromotionQuery,
  useLazyGetMerchantPromotionQuery,
  useGetMerchantPromotionDetailsQuery,
  useLazyGetMerchantPromotionDetailsQuery,
  useCreateMerchantPromotionMutation,
  useUpdateMerchantPromotionMutation,
  useDeleteMerchantPromotionMutation,
  useUpdateMyShopPhotoMutation,
  useSellerClaimFundsMutation,
} = myShopApi;
