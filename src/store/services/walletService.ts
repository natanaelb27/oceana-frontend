import { ActivateWalletRequest, WalletTopUpRequest } from '../../types/request';
import { GetWalletDetailsResponse } from '../../types/response';
import { baseApi } from '../store';

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    walletTopUp: builder.mutation<void, WalletTopUpRequest>({
      query: (request) => ({
        url: '/wallet/topup',
        method: 'POST',
        body: request,
      }),
    }),
    getWalletDetails: builder.query<GetWalletDetailsResponse, void>({
      query: () => ({
        url: '/profile/wallet',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    activateWallet: builder.mutation<
      GetWalletDetailsResponse,
      ActivateWalletRequest
    >({
      query: (request) => ({
        url: '/profile/wallet/activate',
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePinWallet: builder.mutation<void, ActivateWalletRequest>({
      query: (request) => ({
        url: '/profile/wallet/pin',
        method: 'PATCH',
        body: request,
      }),
    }),
  }),
});

export const {
  useGetWalletDetailsQuery,
  useLazyGetWalletDetailsQuery,
  useActivateWalletMutation,
  useWalletTopUpMutation,
  useChangePinWalletMutation,
} = walletApi;
