import {
  IncrementUserCartRequest,
  UpdateUserCartRequest,
  PayCartWithWalletRequest,
  PayCartWithSealabsPayRequest,
  PayCartWithSealabsPaySuccessRequest,
} from '../../types/request';
import {
  GetUserCartResponse,
  UpdateUserCartResponse,
  PaymentResponse,
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
      PaymentResponse,
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
    payCartWithSealabsPay: builder.mutation<
      PaymentResponse,
      PayCartWithSealabsPayRequest
    >({
      query: (request) => ({
        url: '/carts/payment/sealabs-pay',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Cart'],
    }),
    usePayCartWithSealabsPaySuccess: builder.mutation<
      void,
      PayCartWithSealabsPaySuccessRequest
    >({
      query: (request) => ({
        url: '/carts/payment/sealabs-pay/success',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useLazyGetUserCartQuery,
  useUpdateUserCartMutation,
  usePayCartWithWalletMutation,
  useIncrementUserCartMutation,
  usePayCartWithSealabsPayMutation,
  useUsePayCartWithSealabsPaySuccessMutation,
} = cartApi;
