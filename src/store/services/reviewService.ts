import {
  CreateProductReviewResponse,
  GetAllReviewsResponse,
} from '../../types/response';
import { GetAllReviewsRequest } from '../../types/request';
import { baseApi } from '../store';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductReview: builder.mutation<
      CreateProductReviewResponse,
      [FormData, string]
    >({
      query: ([request, id]) => ({
        url: `/reviews/order-details/${id}`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Product', 'Order'],
    }),
    getAllReviews: builder.query<GetAllReviewsResponse, GetAllReviewsRequest>({
      query: ({ id, query }) => ({
        url: `/reviews/products/${id}?${query}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useLazyGetAllReviewsQuery,
  useCreateProductReviewMutation,
} = reviewApi;
