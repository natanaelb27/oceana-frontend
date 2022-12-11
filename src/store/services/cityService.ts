import { GetAllCityResponse } from '../../types/response';
import { baseApi } from '../store';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCity: builder.query<GetAllCityResponse, string>({
      query: (query) => ({
        url: `/cities?${query}`,
        method: 'GET',
      }),
      providesTags: ['City'],
    }),
  }),
});

export const { useGetAllCityQuery, useLazyGetAllCityQuery } = categoryApi;
