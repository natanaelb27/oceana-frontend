import {
  CreateMerchantVoucherRequest,
  MerchantPromotionRequest,
} from '../../types/request';

import {
  CreateMerchantVoucherResponse,
  DeleteMerchantVoucherResponse,
  GetMerchantResponse,
  UpdateMerchantResponse,
  UpdateMerchantVoucherResponse,
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
  }),
});

export const {
  useGetMyShopProfileQuery,
  useLazyGetMyShopProfileQuery,
  useCreateMerchantVoucherMutation,
  useUpdateMerchantVoucherMutation,
  useDeleteMerchantVoucherMutation,
  useGetMerchantPromotionQuery,
  useLazyGetMerchantPromotionQuery,
  useGetMerchantPromotionDetailsQuery,
  useLazyGetMerchantPromotionDetailsQuery,
  useCreateMerchantPromotionMutation,
  useUpdateMerchantPromotionMutation,
  useDeleteMerchantPromotionMutation,
  useUpdateMyShopPhotoMutation,
} = myShopApi;
