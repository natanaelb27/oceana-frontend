import { CreateMerchantRequest } from '../../types/request';
import {
  CreateMerchantResponse,
  MerchantGetInformationByIDResponse,
} from '../../types/response';
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
    getMerchantByID: builder.query<MerchantGetInformationByIDResponse, string>({
      query: (id) => ({
        url: `/shop/information/${id}`,
        method: 'GET',
      }),
      providesTags: ['Merchant', 'MyShop'],
    }),
  }),
});

export const {
  useCreateMerchantMutation,
  useGetMerchantByIDQuery,
  useLazyGetMerchantByIDQuery,
} = merchantApi;
