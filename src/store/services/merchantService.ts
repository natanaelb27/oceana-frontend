import { CreateMerchantRequest } from '../../types/request';
import { CreateMerchantResponse } from '../../types/response';
import { baseApi } from '../store';

export const merchantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMerchant: builder.mutation<
      CreateMerchantResponse,
      CreateMerchantRequest
    >({
      query: (request) => ({
        url: '/profile/register-shop',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Merchant', 'Profile'],
    }),
  }),
});

export const { useCreateMerchantMutation } = merchantApi;
