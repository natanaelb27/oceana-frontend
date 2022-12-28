import {
  GetAllRefundDetailsResponse,
  UpdateRefundResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRefunds: builder.query<GetAllRefundDetailsResponse, string>({
      query: (query) => ({
        url: `/admin/refunds?${query}`,
        method: 'GET',
      }),
      providesTags: ['Refund'],
    }),
    adminCompleteRefund: builder.mutation<UpdateRefundResponse, string>({
      query: (id) => ({
        url: `/admin/refunds/${id}/complete-refund`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order', 'Refund'],
    }),
  }),
});

export const {
  useGetAllRefundsQuery,
  useLazyGetAllRefundsQuery,
  useAdminCompleteRefundMutation,
} = adminApi;
