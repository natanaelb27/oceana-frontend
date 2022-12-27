import { GetRefundDetailsResponse } from '../../types/response';
import { baseApi } from '../store';

export const refundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRefundDetails: builder.query<GetRefundDetailsResponse, string>({
      query: (id) => ({
        url: `/refunds/${id}`,
        method: 'GET',
      }),
      providesTags: ['Refund'],
    }),
  }),
});

export const { useGetRefundDetailsQuery, useLazyGetRefundDetailsQuery } =
  refundApi;
