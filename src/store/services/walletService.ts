import { ActivateWalletRequest } from '../../types/request';
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
  }),
});

export const {
  useGetWalletDetailsQuery,
  useLazyGetWalletDetailsQuery,
  useActivateWalletMutation,
} = walletApi;
