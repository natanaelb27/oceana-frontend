import {
  FavoriteProductResponse,
  GetFavoriteProductResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const favoriteProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    favoriteProduct: builder.mutation<FavoriteProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: ['FavoriteProduct'],
    }),
    getFavoriteProduct: builder.query<GetFavoriteProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}/favorite`,
        method: 'GET',
      }),
      providesTags: ['FavoriteProduct'],
    }),
  }),
});

export const {
  useFavoriteProductMutation,
  useGetFavoriteProductQuery,
  useLazyGetFavoriteProductQuery,
} = favoriteProductApi;
