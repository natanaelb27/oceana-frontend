import { GetAllTransactionHistoryResponse } from '../../types/response';
import { baseApi } from '../store';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactionHistory: builder.query<GetAllTransactionHistoryResponse, string>({
      query: (query) => ({
        url: `/profile/transaction-history?${query}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const { useGetAllTransactionHistoryQuery, useLazyGetAllTransactionHistoryQuery } =
orderApi;
