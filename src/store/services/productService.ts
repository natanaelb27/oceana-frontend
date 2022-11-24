import { GetAllProductsResponse } from '../../types/response';
import { baseApi } from '../store';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<GetAllProductsResponse, string>({
      query: (query) => ({
        url: `/products?${query}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetAllProductsQuery, useLazyGetAllProductsQuery } =
  productApi;
