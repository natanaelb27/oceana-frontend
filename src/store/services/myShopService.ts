import { GetMerchantResponse } from '../../types/response';
import { baseApi } from '../store';

export const myShopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyShopProfile: builder.query<GetMerchantResponse, void>({
      query: () => ({
        url: '/my-shop/profile',
        method: 'GET',
      }),
      providesTags: ['MyShop'],
    }),
  }),
});

export const { useGetMyShopProfileQuery, useLazyGetMyShopProfileQuery } =
  myShopApi;
