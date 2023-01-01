import {
  GetAllMerchantProductRequest,
  CreateMerchantRequest,
} from '../../types/request';
import {
  GetAllProductsResponse,
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
      providesTags: ['Merchant'],
    }),
    getAllMerchantProducts: builder.query<
      GetAllProductsResponse,
      GetAllMerchantProductRequest
    >({
      query: (arg) => {
        const { id, query } = arg;

        return {
          url: `/shop/${id}/products?${query}`,
          method: 'GET',
        };
      },
      providesTags: ['Merchant', 'MyShop'],
    }),
  }),
});

export const {
  useCreateMerchantMutation,
  useGetMerchantByIDQuery,
  useGetAllMerchantProductsQuery,
  useLazyGetMerchantByIDQuery,
} = merchantApi;
