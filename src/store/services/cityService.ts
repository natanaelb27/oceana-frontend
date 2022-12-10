import { GetAllCityResponse } from '../../types/response';
import { baseApi } from '../store';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCity: builder.query<GetAllCityResponse, void>({
      query: () => ({
        url: '/cities',
        method: 'GET',
      }),
      providesTags: ['City'],
    }),
  }),
});

export const { useGetAllCityQuery, useLazyGetAllCityQuery } = categoryApi;
