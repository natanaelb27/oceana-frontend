import { WalletTopUpRequest } from '../../types/request';
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
  }),
});

export const { useWalletTopUpMutation } = walletApi;
