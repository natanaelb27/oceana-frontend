import { GetShopInformationResponse } from '../../types/response';
import { baseApi } from '../store';

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShopInformation: builder.query<
      GetShopInformationResponse,
      string | undefined
    >({
      query: (id) => ({
        url: `/shop/information/${id}`,
        method: 'GET',
      }),
      providesTags: ['Shop'],
    }),
  }),
});

export const { useGetShopInformationQuery } = shopApi;
