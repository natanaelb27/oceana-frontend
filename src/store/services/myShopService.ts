import { GetMerchantResponse } from '../../types/response';
import { baseApi } from '../store';

export const myShopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyShopProfile: builder.query<GetMerchantResponse, void>({
      query: (request) => ({
        url: '/my-shop/profile',
        method: 'GET',
        body: request,
      }),
      providesTags: ['MyShop'],
    }),
  }),
});

export const { useGetMyShopProfileQuery, useLazyGetMyShopProfileQuery } =
  myShopApi;
