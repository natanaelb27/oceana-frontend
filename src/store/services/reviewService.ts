import { CreateProductReviewRequest } from '../../types/request';
import { CreateProductReviewResponse } from '../../types/response';
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
      invalidatesTags: ['Product', 'Order', 'OrderDetails'],
    }),
  }),
});

export const { useCreateProductReviewMutation } = reviewApi;
