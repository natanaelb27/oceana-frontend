import { MerchantCreateRequest } from '../../types/request';
import { MerchantCreateResponse } from '../../types/response';
import { baseApi } from '../store';

export const merchantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMerchant: builder.mutation<MerchantCreateResponse, MerchantCreateRequest>({
            query: (request) => ({
                url: '/profile/register-shop',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Merchant', 'Profile'],
        })
    })
});

export const { useCreateMerchantMutation } = merchantApi;