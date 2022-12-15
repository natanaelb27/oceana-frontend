import { CreateMerchantVoucherRequest } from '../../types/request';

import {
  CreateMerchantVoucherResponse,
  DeleteMerchantVoucherResponse,
  GetMerchantResponse,
  UpdateMerchantResponse,
  UpdateMerchantVoucherResponse,
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
  }),
});

export const {
  useGetMyShopProfileQuery,
  useLazyGetMyShopProfileQuery,
  useCreateMerchantVoucherMutation,
  useUpdateMerchantVoucherMutation,
  useDeleteMerchantVoucherMutation,
  useUpdateMyShopPhotoMutation,
} = myShopApi;
