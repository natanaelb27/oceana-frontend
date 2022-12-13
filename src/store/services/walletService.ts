import { GetWalletDetailsResponse } from '../../types/response';
import { baseApi } from '../store';

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletDetails: builder.query<GetWalletDetailsResponse, void>({
      query: () => ({
        url: '/profile/wallet',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const { useGetWalletDetailsQuery, useLazyGetWalletDetailsQuery } =
  walletApi;
