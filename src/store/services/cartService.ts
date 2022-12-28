import {
  IncrementUserCartRequest,
  UpdateUserCartRequest,
  PayCartWithWalletRequest,
} from '../../types/request';
import {
  GetUserCartResponse,
  UpdateUserCartResponse,
  WalletPaymentResponse,
} from '../../types/response';
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
      invalidatesTags: ['Cart'],
    }),
    incrementUserCart: builder.mutation<
      UpdateUserCartResponse,
      IncrementUserCartRequest
    >({
      query: (request) => ({
        url: '/carts',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useLazyGetUserCartQuery,
  useUpdateUserCartMutation,
  usePayCartWithWalletMutation,
  useIncrementUserCartMutation,
} = cartApi;
