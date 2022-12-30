import { GetCalculatedRefundDetailsRequest } from '../../types/request/';
import {
  CreateRefundOrderResponse,
  GetCalculatedRefundDetailsResponse,
  GetRefundDetailsResponse,
} from '../../types/response/';
import { baseApi } from '../store';

export const refundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRefundOrder: builder.mutation<
      CreateRefundOrderResponse,
      [FormData, string]
    >({
      query: ([request, id]) => ({
        url: `/profile/refunds/${id}`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Refund', 'Order'],
    }),
    getCalculatedRefundDetails: builder.query<
      GetCalculatedRefundDetailsResponse,
      GetCalculatedRefundDetailsRequest
    >({
      query: ({ id, query }) => ({
        url: `/refunds/calculate-refund-details/${id}?${query}`,
        method: 'GET',
      }),
      providesTags: ['Refund'],
    }),
    getRefundDetails: builder.query<GetRefundDetailsResponse, string>({
      query: (id) => ({
        url: `/refunds/${id}`,
        method: 'GET',
      }),
      providesTags: ['Refund'],
    }),
  }),
});

export const {
  useCreateRefundOrderMutation,
  useGetCalculatedRefundDetailsQuery,
  useLazyGetCalculatedRefundDetailsQuery,
  useGetRefundDetailsQuery,
  useLazyGetRefundDetailsQuery,
} = refundApi;
