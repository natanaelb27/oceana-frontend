import {
  GetAllTransactionHistoryResponse,
  GetOrderDetailsResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactionHistory: builder.query<
      GetAllTransactionHistoryResponse,
      string
    >({
      query: (query) => ({
        url: `/profile/transaction-history?${query}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getOrderDetails: builder.query<GetOrderDetailsResponse, string>({
      query: (id) => ({
        url: `/profile/transaction-history/${id}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetails'],
    }),
  }),
});

export const {
  useGetAllTransactionHistoryQuery,
  useLazyGetAllTransactionHistoryQuery,
  useGetOrderDetailsQuery,
  useLazyGetOrderDetailsQuery,
} = orderApi;
