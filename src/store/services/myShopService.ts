import { CreateMerchantVoucherRequest } from '../../types/request';

import {
  CreateMerchantVoucherResponse,
  DeleteMerchantVoucherResponse,
  GetMerchantResponse,
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
    CreateMerchantVoucher: builder.mutation<
      CreateMerchantVoucherResponse,
      CreateMerchantVoucherRequest
    >({
      query: (request) => ({
        url: '/my-shop/vouchers/',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['MerchantVoucher'],
    }),
    DeleteMerchantVoucher: builder.mutation<
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
  useDeleteMerchantVoucherMutation,
  useGetMyShopProfileQuery,
  useLazyGetMyShopProfileQuery,
} = myShopApi;
