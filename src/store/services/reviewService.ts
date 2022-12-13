import { GetAllReviewsRequest } from '../../types/request';
import { GetAllReviewsResponse } from '../../types/response';
import { baseApi } from '../store';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<GetAllReviewsResponse, GetAllReviewsRequest>({
      query: ({ id, query }) => ({
        url: `/reviews/products/${id}?${query}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
  }),
});

export const { useGetAllReviewsQuery, useLazyGetAllReviewsQuery } = reviewApi;
