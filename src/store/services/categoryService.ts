import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetAllCategoryResponse } from '../../types/response';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getAllCategory: builder.query<GetAllCategoryResponse, void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLazyGetAllCategoryQuery } = categoryApi;
