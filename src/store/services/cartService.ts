import { UpdateUserCartRequest } from '../../types/request';
import { PayCartWithWalletRequest } from '../../types/request/checkout';
import {
  GetUserCartResponse,
  UpdateUserCartResponse,
} from '../../types/response';
import { WalletPaymentResponse } from '../../types/response/checkout';
import { baseApi } from '../store';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCart: builder.query<GetUserCartResponse, void>({
      query: () => ({
        url: '/carts',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),
    updateUserCart: builder.mutation<
      UpdateUserCartResponse,
      UpdateUserCartRequest
    >({
      query: (request) => ({
        url: '/carts',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Cart'],
    }),
    payCartWithWallet: builder.mutation<
      WalletPaymentResponse,
      PayCartWithWalletRequest
    >({
      query: (request) => ({
        url: '/carts/payment/wallet',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useUpdateUserCartMutation,
  usePayCartWithWalletMutation,
} = cartApi;
