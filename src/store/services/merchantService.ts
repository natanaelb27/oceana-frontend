import { MerchantCreateRequest } from '../../types/request';
import { MerchantCreateResponse, MerchantGetInformationByIDResponse } from '../../types/response';
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
        }),
        getMerchantByID: builder.query<MerchantGetInformationByIDResponse, string>({
            query: (id) => ({
                url: `/shop/information/${id}`,
                method: 'GET',
            }),
            providesTags: ['Merchant'],
        })
    })
});

export const { useCreateMerchantMutation, useGetMerchantByIDQuery } = merchantApi;