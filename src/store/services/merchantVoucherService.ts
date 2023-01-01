import { GetMerchantVoucherResponse } from '../../types/response';
import { baseApi } from '../store';

export const merchantVoucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMerchantVouchers: builder.query<GetMerchantVoucherResponse, string>({
      query: (query) => ({
        url: `/shop/vouchers?${query}`,
        method: 'GET',
      }),
      providesTags: ['Merchant'],
    }),
  }),
});

export const { useGetAllMerchantVouchersQuery } = merchantVoucherApi;
