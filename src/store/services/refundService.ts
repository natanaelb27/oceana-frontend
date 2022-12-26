import { GetCalculatedRefundDetailsRequest } from '../../types/request/refund';
import {
  CreateRefundOrderResponse,
  GetAllRefundDetailsResponse,
  GetCalculatedRefundDetailsResponse,
} from '../../types/response/refund';
import { baseApi } from '../store';

export const refundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRefundOrder: builder.mutation<
      CreateRefundOrderResponse,
      [FormData, string]
    >({
      query: ([request, id]) => ({
        url: `/refund/${id}`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Refund'],
    }),
    getAllRefundOrders: builder.query<GetAllRefundDetailsResponse, string>({
      query: (query) => ({
        url: `/refund?${query}`,
        method: 'GET',
      }),
      providesTags: ['Refund'],
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
  }),
});

export const {
  useCreateRefundOrderMutation,
  useGetAllRefundOrdersQuery,
  useLazyGetAllRefundOrdersQuery,
  useGetCalculatedRefundDetailsQuery,
  useLazyGetCalculatedRefundDetailsQuery
} = refundApi;
