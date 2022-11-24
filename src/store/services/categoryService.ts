import { GetAllCategoryResponse } from '../../types/response';
import { baseApi } from '../store';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query<GetAllCategoryResponse, void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const { useGetAllCategoryQuery, useLazyGetAllCategoryQuery } =
  categoryApi;
