import { CategoryQuery } from '../../types/query';
import {
  GetAllCategoryResponse,
  GetAncestorsCategoryResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query<GetAllCategoryResponse, string>({
      query: (query) => ({
        url: `/categories?${query}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    getAncestorsCategory: builder.query<GetAncestorsCategoryResponse, string>({
      query: (id) => ({
        url: `/categories/ancestors/${id}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useLazyGetAllCategoryQuery,
  useGetAncestorsCategoryQuery,
  useLazyGetAncestorsCategoryQuery,
} = categoryApi;
